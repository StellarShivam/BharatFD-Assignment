import request from "supertest";
import { expect } from "chai";
import app from "../server.js";
import redisClient from "../config/RedisConfig.js";

describe("FAQ API Tests with Multi-language Support", function () {
  this.timeout(5000);

  let faqId;
  const faqInputs = [
    {
      question: "Why are APIs important?",
      answer:
        "APIs enable seamless communication and integration between different software.",
      targetLanguage: "en",
    },
    {
      question: "Why are APIs important?",
      answer:
        "APIs enable seamless communication and integration between different software.",
      targetLanguage: "hi",
    },
    {
      question: "Why are APIs important?",
      answer:
        "APIs enable seamless communication and integration between different software.",
      targetLanguage: "ur",
    },
  ];

  faqInputs.forEach(({ question, answer, targetLanguage }) => {
    it(`should create a new FAQ with translations in ${targetLanguage}`, async () => {
      const res = await request(app)
        .post("/api/faqs/create-faq")
        .send({ question, answer, targetLanguage });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("message", "FAQ Created Successfully");
      expect(res.body.faq).to.have.property("question", question);
      expect(res.body.faq).to.have.property("answer", answer);

      faqId = res._body.faq._id;
      expect(faqId).to.not.be.undefined;

      const cachedFaqs = await redisClient.get(`faqs:${targetLanguage}`);
      expect(cachedFaqs).to.be.null;
    });

    it(`should fetch all FAQs in ${targetLanguage}`, async () => {
      const res = await request(app).get("/api/faqs").query({ targetLanguage });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("translatedFaqs");
      expect(res.body.translatedFaqs).to.be.an("array").that.is.not.empty;
    });

    it(`should update an existing FAQ and translate into ${targetLanguage}`, async () => {
      const res = await request(app).put(`/api/faqs/${faqId}`).send({
        question: "What are API endpoints?",
        answer:
          "API endpoints are specific routes where API requests are sent and responses are received.",
        targetLanguage,
      });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("message", "Successfully Updated FAQ");
      expect(res.body.UpdatedFAQ).to.have.property(
        "question",
        "What are API endpoints?"
      );
      expect(res.body.UpdatedFAQ).to.have.property(
        "answer",
        "API endpoints are specific routes where API requests are sent and responses are received."
      );
    });

    it(`should delete a FAQ and clear cache for ${targetLanguage}`, async () => {
      const res = await request(app)
        .delete(`/api/faqs/${faqId}`)
        .send({ targetLanguage });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("message", "FAQ Deleted");
    });
  });
});
