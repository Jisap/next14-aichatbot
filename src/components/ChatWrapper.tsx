"use client"

import { useChat } from "ai/react"
import { Messages } from "./Messages"
import { ChatInput } from "./ChatInput"

export const ChatWrapper = ({sessionId}: {sessionId: string}) => {

  const { messages, handleInputChange, handleSubmit, input, setInput } = useChat({  // similar a un state(messages), setState(handleInputChange) para los messages 
    api: "/api/chat-stream",                                                        // Aquí se envían las peticiones (preguntas a la ia)
    body: { sessionId },
  })


  return (
    <div className="relative min-h-full bg-zinc-900 flex divide-y divide-zinc-700 flex-col justify-between gap-2">
      <div className="flex-1 text-black bg-zinc-800 justify-between flex flex-col">
        <Messages messages={messages} />
      </div>

      {/* <form onSubmit={handleSubmit}>
        <input  
          value={input} 
          onChange={handleInputChange} 
          type="text" 
          className="text-black"
        />
        <button type="submit">Send</button>
      </form> */}

        <ChatInput 
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          setInput={setInput}
        />
    </div>
  )
}

