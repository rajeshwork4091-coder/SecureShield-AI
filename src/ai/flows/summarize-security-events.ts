'use server';
/**
 * @fileOverview Summarizes security events to provide a quick understanding of the organization's security posture.
 *
 * - summarizeSecurityEvents - A function that takes a period of time and returns a summary of security events.
 * - SummarizeSecurityEventsInput - The input type for the summarizeSecurityEvents function.
 * - SummarizeSecurityEventsOutput - The return type for the summarizeSecurityEvents function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeSecurityEventsInputSchema = z.object({
  timePeriod: z
    .string()
    .describe("The period of time to summarize security events for, e.g., 'last week', 'last month'."),
  threatsDetected: z.string().describe('Threats detected during the time period.'),
  resolvedIncidents: z.string().describe('Resolved incidents during the time period.'),
  policyChanges: z.string().describe('Policy changes during the time period.'),
});
export type SummarizeSecurityEventsInput = z.infer<typeof SummarizeSecurityEventsInputSchema>;

const SummarizeSecurityEventsOutputSchema = z.object({
  summary: z.string().describe('A summary of security events during the time period.'),
});
export type SummarizeSecurityEventsOutput = z.infer<typeof SummarizeSecurityEventsOutputSchema>;

export async function summarizeSecurityEvents(
  input: SummarizeSecurityEventsInput
): Promise<SummarizeSecurityEventsOutput> {
  return summarizeSecurityEventsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeSecurityEventsPrompt',
  input: {schema: SummarizeSecurityEventsInputSchema},
  output: {schema: SummarizeSecurityEventsOutputSchema},
  prompt: `You are a security analyst. Summarize the following security events for the given time period:\n\nTime Period: {{{timePeriod}}}\nThreats Detected: {{{threatsDetected}}}\nResolved Incidents: {{{resolvedIncidents}}}\nPolicy Changes: {{{policyChanges}}}\n\nSummary: `,
});

const summarizeSecurityEventsFlow = ai.defineFlow(
  {
    name: 'summarizeSecurityEventsFlow',
    inputSchema: SummarizeSecurityEventsInputSchema,
    outputSchema: SummarizeSecurityEventsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
