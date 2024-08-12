import { ragChat } from '../../../lib/rag-chat';
import { NextRequest } from "next/server";
import { aiUseChatAdapter } from "@upstash/rag-chat/nextjs";


export const POST = async ( req: NextRequest ) => {

  const { messages, sessionId } = await req.json()                                  // Se reciben los mensajes(preguntas) y el identificador de la session

  const lastMessage = messages[messages.length - 1 ].content                        // De todos los mensajes(preguntas) obtenemos el último

  const response = await ragChat.chat(lastMessage, { streaming: true, sessionId })  // Se envía a la ia la última pregunta
  
  return aiUseChatAdapter(response)                                                 // Convierte la respuesta en un formato que el frontend espera, como un objeto JSON

}