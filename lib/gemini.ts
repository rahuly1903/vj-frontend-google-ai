import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "" });

export interface SqlFilter {
  id: string;
  label: string;
  type: 'date' | 'select' | 'number' | 'text' | 'date-range';
  options?: string[];
  mandatory: boolean;
  sql_column: string;
  description: string;
}

export interface SqlColumn {
  id: string;
  label: string;
}

export interface SqlAnalysis {
  summary: string;
  filters: SqlFilter[];
  columns: SqlColumn[];
  tableName: string;
  uxSuggestions: string[];
}

export async function analyzeSql(sql: string): Promise<SqlAnalysis> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview", 
    contents: [
      {
        text: `Analyze the following SQL query and provide a structured JSON response to build a frontend dashboard.
        
        SQL Query:
        ${sql}
        
        Follow these rules:
        1. Identify all filters in the WHERE clause or potential filters based on columns.
        2. Convert them into user-friendly frontend input fields.
        3. Rename technical column names into human-readable labels.
        4. Suggest UX improvements.
        
        Return the response in the following JSON format:
        {
          "summary": "A simple English summary of what this report does",
          "filters": [
            {
              "id": "unique_id",
              "label": "Human Label",
              "type": "date" | "select" | "number" | "text" | "date-range",
              "options": ["Option A", "Option B"], // Only for select
              "mandatory": true/false,
              "sql_column": "the_db_column_name",
              "description": "Helpful tooltip text"
            }
          ],
          "columns": [
            { "id": "col_name", "label": "Human Label" }
          ],
          "tableName": "The primary table being queried",
          "uxSuggestions": ["Suggestion 1", "Suggestion 2"]
        }`
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          filters: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                label: { type: Type.STRING },
                type: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                mandatory: { type: Type.BOOLEAN },
                sql_column: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["id", "label", "type", "mandatory", "sql_column"]
            }
          },
          columns: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                label: { type: Type.STRING }
              },
              required: ["id", "label"]
            }
          },
          tableName: { type: Type.STRING },
          uxSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["summary", "filters", "columns", "tableName", "uxSuggestions"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}
