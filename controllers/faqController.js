import redisClient from "../config/RedisConfig.js";
import Faq from "../models/FAQModel.js";
import { translateText } from "../translateUtil/transLateText.js";

export const createFaq = async (req, res) => {
  try {
    const { question, answer, targetLanguage = "en" } = req.body;

    console.log(
      "Processing FAQ creation with question:",
      question,
      "and answer:",
      answer
    );

    const translatedQuestion = await translateText(question, targetLanguage);
    const translatedAnswer = await translateText(answer, targetLanguage);

    const translations = {};
    translations[targetLanguage] = {
      question: translatedQuestion,
      answer: translatedAnswer,
    };

    console.log("Stored translations:", translations);

    const faq = await Faq.create({
      question,
      answer,
      translations,
    });

    console.log("FAQ entry created:", faq);

    await redisClient.del(`faqs:${targetLanguage}`);
    console.log(`Cache purged for faqs:${targetLanguage}`);

    return res.status(200).json({
      message: "FAQ successfully created",
      faq: faq,
    });
  } catch (err) {
    console.error("Error during FAQ creation:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const getAllFaqs = async (req, res) => {
  try {
    const targetLanguage = req.query.targetLanguage || "en";
    console.log("Retrieving FAQs for language:", targetLanguage);

    const cachedFaqs = await redisClient.get(`faqs:${targetLanguage}`);
    if (cachedFaqs) {
      console.log("Loaded cached FAQs for:", targetLanguage);
      return res.status(200).json({
        translatedFaqs: JSON.parse(cachedFaqs),
      });
    }

    console.log("No cached data found, querying database.");

    const faqs = await Faq.find();

    const translatedFaqs = faqs.map((faq) => {
      const translations = faq.translations ? faq.translations : {};
      const translatedData = translations[targetLanguage] || translations["en"];

      const translatedQuestion = translatedData
        ? translatedData.question
        : faq.question;
      const translatedAnswer = translatedData
        ? translatedData.answer
        : faq.answer;

      return {
        ...faq.toObject(),
        translations,
        question: translatedQuestion,
        answer: translatedAnswer,
      };
    });

    await redisClient.setEx(
      `faqs:${targetLanguage}`,
      3600,
      JSON.stringify(translatedFaqs)
    );
    console.log("FAQs cached for language:", targetLanguage);

    return res.status(200).json({
      translatedFaqs,
    });
  } catch (error) {
    console.error("Error while retrieving FAQs:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "FAQ ID is required",
      });
    }

    const { question, answer, targetLanguage = "en" } = req.body;
    console.log(
      "Modifying FAQ entry with ID:",
      id,
      "New question:",
      question,
      "New answer:",
      answer
    );

    const translatedQuestion = await translateText(question, targetLanguage);
    const translatedAnswer = await translateText(answer, targetLanguage);

    const translations = {};
    translations[targetLanguage] = {
      question: translatedQuestion,
      answer: translatedAnswer,
    };
    console.log("Updated translations:", translations);
    const updatedFAQ = await Faq.findByIdAndUpdate(
      id,
      {
        question,
        answer,
        translations,
      },
      { new: true }
    );

    console.log("FAQ successfully updated:", updatedFAQ);

    await redisClient.del(`faqs:${targetLanguage}`);
    console.log(`Cleared cache for faqs:${targetLanguage}`);

    return res.status(200).json({
      message: "FAQ updated successfully",
      UpdatedFAQ: updatedFAQ,
    });
  } catch (err) {
    console.error("Error while updating FAQ:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const deleteFaq = async (req, res) => {
  try {
    const { targetLanguage = "en" } = req.body;
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "FAQ ID is required",
      });
    }

    console.log("Removing FAQ entry with ID:", id);

    await Faq.findByIdAndDelete(id);

    await redisClient.del(`faqs:${targetLanguage}`);
    console.log(`Cache invalidated for faqs:${targetLanguage}`);

    return res.status(200).json({
      message: "FAQ deleted successfully",
    });
  } catch (err) {
    console.error("Error while deleting FAQ:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};
