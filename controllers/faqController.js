import redisClient from "../config/RedisConfig.js";
import Faq from "../models/FAQModel.js";
import { translateText } from "../translateUtil/transLateText.js";

export const createFaq = async (req, res) => {
  try {
    const { question, answer, targetLanguage = "en" } = req.body;

    const translatedQuestion = await translateText(question, targetLanguage);
    const translatedAnswer = await translateText(answer, targetLanguage);

    const translations = {
      [targetLanguage]: {
        question: translatedQuestion,
        answer: translatedAnswer,
      },
    };

    const faq = await Faq.create({ question, answer, translations });

    await redisClient.del(`faqs:${targetLanguage}`);

    return res.status(200).json({ message: "Faq Created Successfully", faq });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

export const getAllFaqs = async (req, res) => {
  try {
    const targetLanguage = req.query.targetLanguage || "en";

    const cachedFaqs = await redisClient.get(`faqs:${targetLanguage}`);
    if (cachedFaqs) {
      return res.status(200).json({ translatedFaqs: JSON.parse(cachedFaqs) });
    }

    const faqs = await Faq.find();

    const translatedFaqs = faqs.map((faq) => {
      const translations = faq.translations || {};
      const translatedData = translations[targetLanguage] || translations["en"];
      return {
        ...faq.toObject(),
        question: translatedData?.question || faq.question,
        answer: translatedData?.answer || faq.answer,
      };
    });

    await redisClient.setEx(
      `faqs:${targetLanguage}`,
      3600,
      JSON.stringify(translatedFaqs)
    );

    return res.status(200).json({ translatedFaqs });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Faq Id not found" });

    const { question, answer, targetLanguage = "en" } = req.body;

    const translatedQuestion = await translateText(question, targetLanguage);
    const translatedAnswer = await translateText(answer, targetLanguage);

    const translations = {
      [targetLanguage]: {
        question: translatedQuestion,
        answer: translatedAnswer,
      },
    };

    const updatedFAQ = await Faq.findByIdAndUpdate(
      id,
      { question, answer, translations },
      { new: true }
    );

    await redisClient.del(`faqs:${targetLanguage}`);

    return res
      .status(200)
      .json({ message: "Successfully Updated Faq", UpdatedFAQ: updatedFAQ });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

export const deleteFaq = async (req, res) => {
  try {
    const { targetLanguage = "en" } = req.body;
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Faq Id not found" });

    await Faq.findByIdAndDelete(id);
    await redisClient.del(`faqs:${targetLanguage}`);

    return res.status(200).json({ message: "Faq Deleted" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
