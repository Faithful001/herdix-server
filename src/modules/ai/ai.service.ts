import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthStatus as CropHealthStatus } from '../crop/enums/health-status.enum';
import { HealthStatus as LivestockHealthStatus } from '../livestock/enums/health-status.enum';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class AiService {
  private ai: GoogleGenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY is not configured');
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  private base64ToArrayBuffer(base64: string): {
    buffer: Buffer;
    mimeType: string;
  } {
    const matches = base64.match(/^data:(image\/[\w+\-]+);base64,(.+)$/);
    let mimeType = 'image/jpeg';
    let base64Data = base64;

    if (matches) {
      mimeType = matches[1];
      base64Data = matches[2];
    } else if (
      base64.startsWith('data:') &&
      !base64.startsWith('data:image/')
    ) {
      throw new Error('Unsupported data URL format or non-image data');
    } else if (!base64.startsWith('data:')) {
      base64Data = base64;
    }

    return {
      buffer: Buffer.from(base64Data, 'base64'),
      mimeType: mimeType,
    };
  }

  private async processImage(image: string, prompt?: string) {
    try {
      const { buffer, mimeType } = this.base64ToArrayBuffer(image);
      const base64Data = buffer.toString('base64');

      // Create the base content with image and optional text
      const content = {
        role: 'user' as const,
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
        ],
      };

      // Create the parts array with both image and optional text
      const parts = [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data,
          },
        },
      ];

      // Add text prompt if provided
      if (prompt) {
        parts.push({
          inlineData: {
            mimeType: 'text/plain',
            data: Buffer.from(prompt).toString('base64'),
          },
        });
      }

      const contents = [
        {
          role: 'user',
          parts: parts,
        },
      ];

      const result = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
      });

      console.log('result', result);

      return result;
    } catch (error) {
      console.error('Error processing image with Gemini:', error);
      throw new Error('Failed to process image with AI' + error);
    }
  }

  async detectCropHealth(image: string) {
    const cropStatuses = Object.values(CropHealthStatus).join(', ');
    const prompt = `You are an expert agricultural analyst. Examine the provided image of a crop carefully, focusing on visual indicators such as leaf color, texture, spots, wilting, pest presence, fruit maturity, or signs of harvest readiness.

    Classify the crop's health status as exactly one of the following: ${cropStatuses}. Base your classification on clear visual evidence from the image.
    
    Then, return a valid JSON object with:
    - "healthStatus": The exact health status string from the list above.
    - "confidence": A number between 0.0 and 1.0 indicating how certain you are, based on the strength and clarity of visual evidence (e.g., 1.0 for obvious features, lower for ambiguous ones).
    - "description": A concise explanation (1-2 sentences) of the visual reasoning behind the health status, referencing specific image details like "yellowing leaves indicate disease" or "uniform green foliage shows health".
    - "recommendation":
      - If healthStatus is "Healthy", set to an empty string "".
      - If healthStatus is "Harvested", set to "The crop appears ready for harvest; proceed with collection to avoid over-ripening."
      - Otherwise (Diseased, Pest-infested, or Withered), provide a practical 1-2 sentence recommendation on addressing the issue, such as treatment, removal, or monitoring (e.g., "Apply fungicide immediately and remove affected leaves to prevent spread.").
    
    Respond only with the JSON object. Do not include any additional text.
    
    Examples:
    For a healthy crop: {"healthStatus": "Healthy", "confidence": 0.95, "description": "The leaves are vibrant green with no discoloration, spots, or wilting, indicating vigorous growth.", "recommendation": ""}
    For a diseased crop: {"healthStatus": "Diseased", "confidence": 0.85, "description": "Brown spots and yellowing edges on multiple leaves suggest fungal infection.", "recommendation": "Isolate affected plants and apply an organic fungicide; monitor for spread over the next 48 hours.`;

    const response = await this.processImage(image, prompt);
    const llmResponse = response.candidates[0].content.parts[0].text;

    const cleanedResponse = llmResponse
      .replace(/^```(?:json)?\s*|```$/g, '')
      .replace(/\n+/g, '\n')
      .trim();

    return {
      message: 'Crop health detected successfully',
      data: JSON.parse(cleanedResponse),
    };
  }

  async detectLivestockHealth(image: string) {
    const livestockStatuses = Object.values(LivestockHealthStatus).join(', ');
    const prompt = `You are an expert veterinary analyst. Carefully examine the provided image of livestock, focusing on visual indicators such as posture, coat condition, eye clarity, skin lesions, breathing patterns, or signs of injury or distress.

Classify the livestock's health status as exactly one of: ${livestockStatuses}. Base your classification on clear visual evidence from the image.

Then, return a valid JSON object with:
- "healthStatus": The exact health status string from the list above.
- "confidence": A number between 0.0 and 1.0 indicating how certain you are, based on the strength and clarity of visual evidence (e.g., 1.0 for obvious symptoms like visible wounds, lower for ambiguous signs).
- "description": A concise explanation (1-2 sentences) of the visual reasoning behind the health status, referencing specific image details like "dull coat and limping suggest injury" or "clear eyes and alert posture indicate health".
- "recommendation":
  - If healthStatus is "Healthy", set to an empty string "".
  - If healthStatus is "Recovered", set to "Monitor the animal to ensure continued recovery."
  - If healthStatus is "Deceased", set to "Remove the animal promptly and follow biosecurity protocols to prevent disease spread."
  - Otherwise (Sick, Injured, or Quarantined), provide a practical 1-2 sentence recommendation, such as consulting a veterinarian, isolating the animal, or treating specific symptoms (e.g., "Administer antibiotics and isolate the animal for Sick healthStatus.").

Respond only with the JSON object. Do not include any additional text.

Examples:
For a healthy animal: {"healthStatus": "Healthy", "confidence": 0.95, "description": "The animal has a shiny coat, clear eyes, and alert posture, indicating good health.", "recommendation": ""}
For an injured animal: {"healthStatus": "Injured", "confidence": 0.90, "description": "Visible limp and a wound on the left leg suggest physical injury.", "recommendation": "Clean and dress the wound, and consult a veterinarian for further assessment."}`;

    const response = await this.processImage(image, prompt);
    const llmResponse = response.candidates[0].content.parts[0].text;

    const cleanedResponse = llmResponse
      .replace(/^```(?:json)?\s*|```$/g, '')
      .replace(/\n+/g, '\n')
      .trim();

    return {
      message: 'Livestock health detected successfully',
      data: JSON.parse(cleanedResponse),
    };
  }
}
