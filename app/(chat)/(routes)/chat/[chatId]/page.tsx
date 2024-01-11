import { auth, redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import { ChatClient } from "./components/client";

interface ChatIdProps {
  params: {
    chatId: string;
  };
}

const ChatIdPage = async ({ params }: ChatIdProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const character = await prismadb.character.findUnique({
    where: {
      id: params.chatId,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
        where: {
          userId,
        },
      },
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });

  if (!character) {
    return redirect("/");
  }

  return <ChatClient character={character} />;
};

export default ChatIdPage;
