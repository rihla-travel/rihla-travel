
const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "20kb" }));
app.use(express.static(__dirname));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
  });

  app.post("/api/plan", async (req, res) => {
    try {
        const {
              destination,
                    travellers,
                          budget,
                                duration,
                                      travelStyle,
                                            interests
                                                } = req.body;

                                                    if (!destination || typeof destination !== "string") {
                                                          return res.status(400).json({
                                                                  error: "Please provide a destination."
                                                                        });
                                                                            }

                                                                                const prompt = `
                                                                                You are RIHLA, a premium international travel planning assistant.

                                                                                Create a personalised travel itinerary using these details:

                                                                                Destination: ${destination}
                                                                                Travellers: ${travellers || "Not specified"}
                                                                                Budget: ${budget || "Not specified"}
                                                                                Duration: ${duration || "Not specified"}
                                                                                Travel style: ${travelStyle || "Not specified"}
                                                                                Interests: ${interests || "Not specified"}

                                                                                Requirements:
                                                                                1. Create a day-by-day itinerary.
                                                                                2. Suggest suitable activities and experiences.
                                                                                3. Give a realistic estimated budget breakdown.
                                                                                4. Explain why your recommendations fit the traveller.
                                                                                5. Include practical travel tips.
                                                                                6. Never invent live hotel prices, flight prices, availability or ratings.
                                                                                7. Clearly label estimates as estimates.
                                                                                8. Use elegant, helpful and concise language.

                                                                                Return the result in clear, readable Markdown.
                                                                                `;

                                                                                    const response = await ai.models.generateContent({
                                                                                          model: "gemini-3.6-flash",
                                                                                                contents: prompt
                                                                                                    });

                                                                                                        res.json({
                                                                                                              success: true,
                                                                                                                    itinerary: response.text
                                                                                                                        });

                                                                                                                          } catch (error) {
                                                                                                                              console.error("RIHLA AI error:", error.message);

                                                                                                                                  res.status(500).json({
                                                                                                                                        error: "RIHLA couldn't generate your itinerary. Please try again."
                                                                                                                                            });
                                                                                                                                              }
                                                                                                                                              });

                                                                                                                                              app.listen(PORT, "0.0.0.0", () => {
                                                                                                                                                console.log(`RIHLA AI server running on port ${PORT}`);
                                                                                                                                                });
