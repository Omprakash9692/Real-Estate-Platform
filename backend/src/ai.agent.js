import mongoose from "mongoose";

import { ChatGoogleGenerativeAI }
  from "@langchain/google-genai";

import {
  createReactAgent
}
  from "@langchain/langgraph/prebuilt";

import {
  DynamicStructuredTool
}
  from "@langchain/core/tools";

import {
  MemorySaver
}
  from "@langchain/langgraph";

import { z } from "zod";


// import model once
import "./models/property.model.js";


let agent;


// memory store
const memory =
  new MemorySaver();




// main function
export async function runAgent(
  message,
  userId = "default"
) {

  const Property =
    mongoose.model("Property");



  if (!agent) {


    // Gemini model
    const model =
      new ChatGoogleGenerativeAI({
        model:
          "gemini-1.5-flash",

        apiKey:
          process.env.GEMINI_API_KEY,

        temperature: 0.7,

        maxOutputTokens: 512,

      });



    // TOOL 1
    const propertySearchTool =
      new DynamicStructuredTool({

        name: "searchProperty",

        description:
          "Search property by city, price, bhk",

        schema:
          z.object({

            city:
              z.string().optional(),

            maxPrice:
              z.number().optional(),

            bhk:
              z.string().optional(),

            status:
              z.string().optional(),

            furnishing:
              z.string().optional(),

          }),



        func: async ({
          city,
          maxPrice,
          bhk,
          status,
          furnishing
        }) => {

          const query = {};

          if (city)
            query.city =
              new RegExp(city, "i");

          if (maxPrice)
            query.price =
              { $lte: maxPrice };

          if (bhk)
            query.bhk = bhk;

          if (status)
            query.status = status;

          if (furnishing)
            query.furnishing =
              new RegExp(furnishing, "i");



          const properties =
            await Property.find(query)

              .limit(5)

              .select(
                "title price city bhk propertyType status amenities description"
              );



          if (!properties.length)
            return "No properties found";



          return JSON.stringify(
            properties
          );

        }

      });



    // TOOL 2
    const propertyDetailsTool =
      new DynamicStructuredTool({

        name:
          "getPropertyDetails",

        description:
          "Get property full details using title",

        schema:
          z.object({

            title:
              z.string(),

          }),



        func:
          async ({ title }) => {

            const property =
              await Property.findOne({

                title:
                  new RegExp(title, "i"),

              });



            if (!property)
              return "Property not found";



            return JSON.stringify({

              title:
                property.title,

              price:
                property.price,

              city:
                property.city,

              bhk:
                property.bhk,

              amenities:
                property.amenities,

              description:
                property.description,

              furnishing:
                property.furnishing,

            });

          }

      });



    // CREATE AGENT
    agent =
      createReactAgent({

        llm: model,

        tools: [

          propertySearchTool,
          propertyDetailsTool

        ],

        checkpointSaver:
          memory,

        prompt:

          `You are a smart real estate assistant.

Rules:

1. Remember previous conversation
2. When user asks facilities, use previous property
3. Answer clearly
4. Be short and helpful`

      });

  }




  // run agent
  const response =
    await agent.invoke(

      {

        messages: [

          {

            role: "user",

            content: message

          }

        ],

      },

      {

        configurable: {

          thread_id:
            userId

        }

      }

    );



  return response
    .messages
    .at(-1)
    .content;


}