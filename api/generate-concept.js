
export default async function handler(req, res) {
  if (req.method !== "POST") {
      return res.status(405).json({
            error: "Method not allowed"
                });
                  }

                    try {
                        const apiKey = process.env.GOOGLE_AI_API_KEY;

                            if (!apiKey) {
                                  return res.status(500).json({
                                          error: "Google AI API key is not configured."
                                                });
                                                    }

                                                        const { topic, language, style } = req.body || {};

                                                            if (
                                                                  typeof topic !== "string" ||
                                                                        topic.trim().length < 2 ||
                                                                              topic.length > 500
                                                                                  ) {
                                                                                        return res.status(400).json({
                                                                                                error: "Please enter a topic between 2 and 500 characters."
                                                                                                      });
                                                                                                          }

                                                                                                              const prompt = `
                                                                                                              Create an original, family-friendly short video concept.

                                                                                                              Topic: ${topic.trim()}
                                                                                                              Language: ${language || "Amharic"}
                                                                                                              Style: ${style || "Educational"}

                                                                                                              Return:
                                                                                                              1. A short title
                                                                                                              2. An engaging opening hook
                                                                                                              3. A 20-35 second video script
                                                                                                              4. Short captions
                                                                                                              5. Relevant hashtags
                                                                                                              6. A closing call to action

                                                                                                              Use original ideas. Avoid dangerous challenges, adult content,
                                                                                                              harmful instructions, and copyrighted scripts.
                                                                                                              Return the answer in clear text.
                                                                                                              `;

                                                                                                                  const response = await fetch(
                                                                                                                        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
                                                                                                                              {
                                                                                                                                      method: "POST",
                                                                                                                                              headers: {
                                                                                                                                                        "Content-Type": "application/json",
                                                                                                                                                                  "x-goog-api-key": apiKey
                                                                                                                                                                          },
                                                                                                                                                                                  body: JSON.stringify({
                                                                                                                                                                                            contents: [
                                                                                                                                                                                                        {
                                                                                                                                                                                                                      parts: [{ text: prompt }]
                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                            ]
                                                                                                                                                                                                                                                    })
                                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                                              );

                                                                                                                                                                                                                                                                  const data = await response.json();

                                                                                                                                                                                                                                                                      if (!response.ok) {
                                                                                                                                                                                                                                                                            console.error("Google AI error:", data);
                                                                                                                                                                                                                                                                                  return res.status(502).json({
                                                                                                                                                                                                                                                                                          error: "AI generation failed. Please try again."
                                                                                                                                                                                                                                                                                                });
                                                                                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                                                                                        const result =
                                                                                                                                                                                                                                                                                                              data.candidates?.[0]?.content?.parts
                                                                                                                                                                                                                                                                                                                      ?.map(part => part.text || "")
                                                                                                                                                                                                                                                                                                                              .join("\n");

                                                                                                                                                                                                                                                                                                                                  if (!result) {
                                                                                                                                                                                                                                                                                                                                        return res.status(502).json({
                                                                                                                                                                                                                                                                                                                                                error: "The AI returned an empty response."
                                                                                                                                                                                                                                                                                                                                                      });
                                                                                                                                                                                                                                                                                                                                                          }

                                                                                                                                                                                                                                                                                                                                                              return res.status(200).json({
                                                                                                                                                                                                                                                                                                                                                                    success: true,
                                                                                                                                                                                                                                                                                                                                                                          concept: result
                                                                                                                                                                                                                                                                                                                                                                              });

                                                                                                                                                                                                                                                                                                                                                                                } catch (error) {
                                                                                                                                                                                                                                                                                                                                                                                    console.error("Generation error:", error);

                                                                                                                                                                                                                                                                                                                                                                                        return res.status(500).json({
                                                                                                                                                                                                                                                                                                                                                                                              error: "Something went wrong. Please try again."
                                                                                                                                                                                                                                                                                                                                                                                                  });
                                                                                                                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                                                                                                                    