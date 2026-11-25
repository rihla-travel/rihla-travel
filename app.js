
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("trip-form");

    if (!form) {
        console.error("RIHLA: Trip form not found.");
            return;
              }

                let results = document.getElementById("trip-results");

                  if (!results) {
                      results = document.createElement("section");
                          results.id = "trip-results";
                              results.className = "trip-results";
                                  form.insertAdjacentElement("afterend", results);
                                    }

                                      const getValue = (id) =>
                                          document.getElementById(id)?.value?.trim() || "";

                                            form.addEventListener("submit", async (event) => {
                                                event.preventDefault();

                                                    const destination = getValue("destination");
                                                        const travellers = getValue("travellers");
                                                            const budget = getValue("budget");

                                                                if (!destination) {
                                                                      alert("Please enter a destination.");
                                                                            return;
                                                                                }

                                                                                    const submitButton = form.querySelector(
                                                                                          'button[type="submit"], input[type="submit"]'
                                                                                              );

                                                                                                  if (submitButton) {
                                                                                                        submitButton.disabled = true;
                                                                                                              submitButton.textContent = "Planning your journey...";
                                                                                                                  }

                                                                                                                      results.hidden = false;
                                                                                                                          results.textContent = "RIHLA is creating your personalised itinerary...";
                                                                                                                              results.scrollIntoView({ behavior: "smooth" });

                                                                                                                                  try {
                                                                                                                                        const response = await fetch("/api/plan", {
                                                                                                                                                method: "POST",
                                                                                                                                                        headers: {
                                                                                                                                                                  "Content-Type": "application/json"
                                                                                                                                                                          },
                                                                                                                                                                                  body: JSON.stringify({
                                                                                                                                                                                            destination,
                                                                                                                                                                                                      travellers,
                                                                                                                                                                                                                budget: budget ? `SAR ${budget}` : "",
                                                                                                                  
                                                                                                                                                                                                                                              duration: getValue("duration"),
                                                                                                                                                                                                                                              travelStyle: getValue("travel-style"),
                                                                                                                                                                                                                                              flightClass: getValue("flight-class"),
                                                                                                                                                                                                                                              interests: getValue("interests"),
                                                                                                                                                                                                                                              hotelLevel: getValue("hotel-level"),
                                                                                                                                                                                                                                              carType: getValue("car-type"),
                                                                                                                                                                                                                                              budgetFlexibility: getValue("budget-flexibility")
                                                                                                                                                                                                                                                      })
                                                                                                                                                                                                                                                            });

                                                                                                                                                                                                                                                                  const raw = await response.text();

                                                                                                                                                                                                                                                                  let data;

                                                                                                                                                                                                                                                                  try {
                                                                                                                                                                                                                                                                    data = JSON.parse(raw);
                                                                                                                                                                                                                                                                    } catch {
                                                                                                                                                                                                                                                                      throw new Error(
                                                                                                                                                                                                                                                                          "The AI server returned an incomplete response. Please try again."
                                                                                                                                                                                                                                                                            );
                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                        if (!response.ok) {
                                                                                                                                                                                                                                                                                throw new Error(data.error || "Unable to create your trip.");
                                                                                                                                                                                                                                                                                      }

                                                                                                                                                                                                                                                                                            results.replaceChildren();

                                                                                                                                                                                                                                                                                                  const heading = document.createElement("h2");
                                                                                                                                                                                                                                                                                                        heading.textContent = `Your RIHLA to ${destination}`;

                                                                                                                                                                                                                                                                                                              const itinerary = document.createElement("div");
                                                                                                                                                                                                                                                                                                                    itinerary.className = "ai-itinerary";
                                                                                                                                                                                                                                                                                                                          itinerary.style.whiteSpace = "pre-wrap";
                                                                                                                                                                                                                                                                                                                                itinerary.textContent = data.itinerary;

                                                                                                                                                                                                                                                                                                                                      const disclaimer = document.createElement("p");
                                                                                                                                                                                                                                                                                                                                            disclaimer.className = "demo-label";
                                                                                                                                                                                                                                                                                                                                                  disclaimer.textContent =
                                                                                                                                                                                                                                                                                                                                                          "Travel prices and availability must be verified with providers.";

                                                                                                                                                                                                                                                                                                                                                                results.append(heading, itinerary, disclaimer);

                                                                                                                                                                                                                                                                                                                                                                    } catch (error) {
                                                                                                                                                                                                                                                                                                                                                                          results.textContent =
                                                                                                                                                                                                                                                                                                                                                                                  "RIHLA couldn't create your trip: " + error.message;
                                                                                                                                                                                                                                                                                                                                                                                        console.error(error);
                                                                                                                                                                                                                                                                                                                                                                                            } finally {
                                                                                                                                                                                                                                                                                                                                                                                                  if (submitButton) {
                                                                                                                                                                                                                                                                                                                                                                                                          submitButton.disabled = false;
                                                                                                                                                                                                                                                                                                                                                                                                                  submitButton.textContent = "Create my trip";
                                                                                                                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                                                                                                                                                              });
                                                                                                                                                                                                                                                                                                                                                                                                                              });
                                                                                                                                                                                                                                                                                                                                                                                                                              