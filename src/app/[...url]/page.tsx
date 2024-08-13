import { ChatWrapper } from "@/components/ChatWrapper";
import { ragChat } from "@/lib/rag-chat";
import { redis } from "@/lib/redis";
import { cookies } from "next/headers";



interface PageProps {
  params: {
    url: string | string[] | undefined
  }
}

function reconstructUrl({ url }: { url: string[] }) {                                 // La url que llega viene como un [strings] -> ['https%3A', 'es.wikipedia.org', 'wiki', 'Rent-A-Car']
  const decodedComponents = url.map((component) => decodeURIComponent(component))     // %20 lo convierte en un espacio, o %2F en /
  return decodedComponents.join("/")                                                  // Utiliza el método join("/") para concatenar todos los elementos de decodedComponents, separándolos con un /.
}

const Page = async({ params }: PageProps) => {
  
  const sessionCookie = cookies().get("sessionId")?.value                             // se obtiene la cookie

  const reconstructedUrl = reconstructUrl({url: params.url as string[]})

  const sessionId = (reconstructedUrl + "--" + sessionCookie).replace(/\//g, "");     // se renombra para que sea única 

  const isAlreadyIndexed = await redis.sismember("indexed-urls", reconstructedUrl)    // Se comprueba si la url estaba ya indexada en la bd

  const initialMessages = await ragChat.history.getMessages({ amount: 10, sessionId });

  if(!isAlreadyIndexed){                                                              // Sino lo estaba se envia a ragchat
    await ragChat.context.add({
      type: "html",
      source: reconstructedUrl,
      config: { chunkOverlap: 50, chunkSize: 200 },
    })

    await redis.sadd("indexed-urls", reconstructedUrl)                                // y se guarda en bd
  }


  return (
    <ChatWrapper sessionId={sessionId} initialMessages={initialMessages} />
  )
}

export default Page