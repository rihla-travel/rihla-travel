
const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "20kb" }));
app.use(express.static(__dirname));

if (!process.env.GEMINI_API_KEY) {
  console.error("Missing GEMINI_API_KEY environment variable.");
    process.exit(1);
    }

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
                                                interests,
                                                      hotelLevel,
                                                            flightClass,
                                                                  carType,
                                                                        budgetFlexibility
                                                                            } = req.body || {};

                                                                                if (!destination || typeof destination !== "string") {
                                                                                      return res.status(400).json({
                                                                                              error: "Please enter a destination."
                                                                                                    });
                                                                                                        }

                                                                                                            const prompt = `
                                                                                                            You are RIHLA, a premium international travel planning assistant.

                                                                                                            Your job is to help customers plan a complete trip, not simply
                                                                                                            write an itinerary.

                                                                                                            CUSTOMER DETAILS:
                                                                                                            Destination: ${destination}
                                                                                                            Travellers: ${travellers || "Not specified"}
                                                                                                            Total trip budget: ${budget || "Not specified"}
                                                                                                            Trip duration: ${duration || "Not specified"}
                                                                                                            Travel style: ${travelStyle || "Not specified"}
                                                                                                            Interests: ${interests || "Not specified"}

                                                                                                            CUSTOMER PREFERENCES:
                                                                                                            Hotel level: ${hotelLevel || "Not specified"}
                                                                                                            Flight class: ${flightClass || "Not specified"}
                                                                                                            Car rental type: ${carType || "Not specified"}
                                                                                                            Budget flexibility: ${budgetFlexibility || "Ask before exceeding"}

                                                                                                            MAIN PRIORITIES:

                                                                                                            1. Plan flights, accommodation and car rental first.
                                                                                                            2. Respect the customer's chosen preferences.
                                                                                                            3. Divide the total trip budget intelligently between
                                                                                                               flights, hotels and car rental.
                                                                                                               4. Explain the estimated cost of each category separately.
                                                                                                               5. Calculate their combined estimated cost.
                                                                                                               6. Show the remaining budget or the amount over budget.
                                                                                                               7. Do not silently downgrade a customer's preferences
                                                                                                                  to force the trip into budget.
                                                                                                                  8. If the estimated total exceeds the budget, clearly
                                                                                                                     explain the difference and ask whether the customer
                                                                                                                        is willing to exceed their original budget.
                                                                                                                        9. If they are not willing to exceed it, suggest changes
                                                                                                                           to their preferences and ask which changes they approve.
                                                                                                                           10. If they accept exceeding the budget, explain the
                                                                                                                               revised estimated total.
                                                                                                                               11. Explain why each recommendation suits the customer.
                                                                                                                               12. Suggest activities, restaurants and attractions
                                                                                                                                   as additional options.
                                                                                                                                   13. Include a day-by-day itinerary only as an optional
                                                                                                                                       additional section.

                                                                                                                                       IMPORTANT ACCURACY RULES:

                                                                                                                                       - You do not have live booking inventory unless verified
                                                                                                                                         provider data is supplied separately.
                                                                                                                                         - Never invent live flight fares, hotel rates, availability,
                                                                                                                                           ratings or car rental prices.
                                                                                                                                           - Clearly label any planning estimates as estimates.
                                                                                                                                           - If essential information is missing, ask the customer
                                                                                                                                             instead of pretending to know it.
                                                                                                                                             - Never claim that a booking has been made.
                                                                                                                                             - Do not treat an unconfirmed estimate as a guaranteed price.

                                                                                                                                             RESPONSE FORMAT:

                                                                                                                                             A. Trip overview
                                                                                                                                             B. Flight recommendations
                                                                                                                                             C. Hotel recommendations
                                                                                                                                             D. Car rental recommendations
                                                                                                                                             E. Estimated budget breakdown
                                                                                                                                             F. Total estimated trip cost
                                                                                                                                             G. Remaining budget or amount exceeding budget
                                                                                                                                             H. Budget approval question, if necessary
                                                                                                                                             I. Optional experiences and itinerary

                                                                                                                                             Use clear headings, professional language and helpful
                                                                                                                                             explanations. Make the budget calculation easy to understand.
                                                                                                                                             `;

                                                                                                                                                 const response = await ai.models.generateContent({
                                                                                                                                                       model: "gemini-3.6-flash",
                                                                                                                                                             contents: prompt
                                                                                                                                                                 });

                                                                                                                                                                     return res.json({
                                                                                                                                                                           success: true,
                                                                                                                                                                                 itinerary: response.text
                                                                                                                                                                                     });

                                                                                                                                                                                       } catch (error) {
                                                                                                                                                                                           console.error("RIHLA AI error:", error);

                                                                                                                                                                                               return res.status(500).json({
                                                                                                                                                                                                     error: "RIHLA could not generate your trip. Please try again."
                                                                                                                                                                                                         });
                                                                                                                                                                                                           }
                                                                                                                                                                                                           });

                                                                                                                                                                                                           app.listen(PORT, "0.0.0.0", () => {
                                                                                                                                                                                                             console.log(`RIHLA AI server running on port ${PORT}`);
                                                                                                                                                                                                             }) 
