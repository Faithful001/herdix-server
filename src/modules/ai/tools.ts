import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { AiService } from './ai.service';

export const createCropHealthTool = (aiService: AiService, image?: string) => {
  return tool(
    async () => {
      if (!image) {
        return 'No image provided for analysis. Please upload an image of the crop.';
      }
      try {
        const result = await aiService.detectCropHealth(image);
        return JSON.stringify(result);
      } catch (e) {
        return `Error analyzing crop: ${e instanceof Error ? e.message : String(e)}`;
      }
    },
    {
      name: 'detect_crop_health',
      description:
        'Call this to analyze the currently uploaded crop image for health issues, diseases, or pests.',
      schema: z.object({}),
    },
  );
};

export const createLivestockHealthTool = (
  aiService: AiService,
  image?: string,
) => {
  return tool(
    async () => {
      if (!image) {
        return 'No image provided for analysis. Please upload an image of the livestock.';
      }
      try {
        const result = await aiService.detectLivestockHealth(image);
        return JSON.stringify(result);
      } catch (e) {
        return `Error analyzing livestock: ${e instanceof Error ? e.message : String(e)}`;
      }
    },
    {
      name: 'detect_livestock_health',
      description:
        'Call this to analyze the currently uploaded livestock image for health issues, injuries, or diseases.',
      schema: z.object({}),
    },
  );
};
