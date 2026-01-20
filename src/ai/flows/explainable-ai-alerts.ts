'use server';

/**
 * @fileOverview A flow that generates explainable AI alerts for potential threats.
 *
 * - generateExplainableAlert - A function that generates an explainable alert for a given threat.
 * - ExplainableAlertInput - The input type for the generateExplainableAlert function.
 * - ExplainableAlertOutput - The return type for the generateExplainableAlert function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainableAlertInputSchema = z.object({
  threatType: z.string().describe('The type of threat detected.'),
  detectionMethod: z.string().describe('The method used to detect the threat.'),
  rawTelemetry: z.string().describe('The raw telemetry data associated with the threat.'),
  riskScore: z.number().describe('The risk score associated with the threat (0-100).'),
});
export type ExplainableAlertInput = z.infer<typeof ExplainableAlertInputSchema>;

const ExplainableAlertOutputSchema = z.object({
  explanation: z.string().describe('A detailed explanation of the threat, including its potential impact and recommended actions.'),
  severity: z.enum(['low', 'medium', 'high']).describe('The severity level of the threat.'),
  quarantineRecommended: z.boolean().describe('Whether or not quarantine is recommended.'),
  resolveActions: z.array(z.string()).describe('A list of recommended actions to resolve the threat.'),
});
export type ExplainableAlertOutput = z.infer<typeof ExplainableAlertOutputSchema>;

export async function generateExplainableAlert(input: ExplainableAlertInput): Promise<ExplainableAlertOutput> {
  return explainableAlertFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainableAlertPrompt',
  input: {schema: ExplainableAlertInputSchema},
  output: {schema: ExplainableAlertOutputSchema},
  prompt: `You are a security analyst providing explainable AI output for potential threats.

You will receive information about a detected threat, including its type, detection method, associated telemetry data, and risk score.

Based on this information, you will generate a detailed explanation of the threat, assess its severity, recommend quarantine if necessary, and suggest actions to resolve the threat.

Threat Type: {{{threatType}}}
Detection Method: {{{detectionMethod}}}
Raw Telemetry Data: {{{rawTelemetry}}}
Risk Score: {{{riskScore}}}

Explanation:
Severity:
Quarantine Recommended:
Resolve Actions:`, 
});

const explainableAlertFlow = ai.defineFlow(
  {
    name: 'explainableAlertFlow',
    inputSchema: ExplainableAlertInputSchema,
    outputSchema: ExplainableAlertOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
