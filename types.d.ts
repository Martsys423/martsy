// Fix for Zod schema issues
declare module "langchain/output_parsers" {
  import { z } from "zod";
  
  export class StructuredOutputParser {
    static fromZodSchema(schema: any): StructuredOutputParser;
    getFormatInstructions(): string;
    parse(text: string): Promise<any>;
  }
}

// Fix for BaseMessageChunk issues
declare module "@langchain/core/messages" {
  export class BaseMessageChunk {
    content: string | any;
    toString(): string;
  }
} 