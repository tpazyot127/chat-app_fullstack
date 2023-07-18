import React, { FormEvent, useRef, KeyboardEvent } from "react";
import { useEffect, useState } from "react";
import { useTypedSelector, useChatActions, useLocalStorage } from "../../hooks";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import CircularProgress from "@mui/material/CircularProgress";
import Image from "next/image";
interface ReturnedData {
  content: string;
  role: string;
  _id: string;
}


const Dashboard: React.FC = () => {
  const { createChat, saveChat, fetchChats } = useChatActions();

  const { error, data, loading }: any = useTypedSelector((state) => state.chat);

  const chatData: any = useTypedSelector((state) => state.chatMessages.data);
  const accessToken = useLocalStorage("", "accessToken");
  
  const [userInput, setUserInput] = useState("");
  const [errorData, setErrorData] = useState<ReturnedData | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (chatData && chatData.chat) {
      try {
        const chat = JSON.parse(chatData.chat);
        const returnedMessages = JSON.parse(chat?.context) || [];
        setMessages(returnedMessages.messages)
      } catch (error) {
        console.error("Error parsing chat:", error);
      }
    }
  }, [chatData && chatData.chat]);


  // Auto scroll chat to bottom
  useEffect(() => {
    if (messageListRef.current) {
      const messageList = messageListRef.current;
      messageList.scrollTop = messageList.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
      fetchChats();
  }, []);

  // Focus on input field
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (data.content) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: data.content },
      ]);
    }
  }, [data]);

  useEffect(() => {
    if (messages.length > 0) {
      saveChat(JSON.stringify({ messages }));
    }
  }, [messages, saveChat]);

  useEffect(() => {
    setErrorData(error);
  }, [error]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (userInput.trim() === "") {
      return;
    }
    const context = [...messages, { role: "user", content: userInput }];

    createChat(JSON.stringify({ messages: context }));
    setMessages(context);

    // Reset user input
    setUserInput("");

    if (errorData) {
      handleError();
      return;
    }
  };

  // Handle errors
  const handleError = () => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: "assistant",
        content: "Oops! There seems to be an error. Please try again.",
      },
    ]);
    setUserInput("");
  };

  const messageListRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleEnter = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && userInput) {
      if (!e.shiftKey && userInput) {
        handleSubmit(e);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <div>
      <Container>
        <Row>
          <Col>
            <main className="main">
              <div className="cloud">
                <div ref={messageListRef} className="messagelist">
                  {messages.map((message, index) => {
                    return (
                      // The latest message sent by the user will be animated while waiting for a response
                      <div
                        key={index}
                        className={
                          message.role === "user" &&
                          loading &&
                          index === messages.length - 1
                            ? "usermessagewaiting"
                            : message.role === "assistant"
                            ? "apimessage"
                            : "usermessage"
                        }
                      >
                        {/* Display the correct icon depending on the message type */}
                        {message.role === "assistant" ? (
                          <Image
                            src="/images/openai.png"
                            alt="AI"
                            width="30"
                            height="30"
                            className="boticon"
                            priority={true}
                          />
                        ) : (
                          <Image
                            src="/images/usericon.png"
                            alt="Me"
                            width="30"
                            height="30"
                            className="usericon"
                            priority={true}
                          />
                        )}
                        <div className="markdownanswer">
                          {/* Messages are being rendered in Markdown format */}
                          <ReactMarkdown linkTarget={"_blank"}>
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="center">
                <div className="cloudform">
                  <form onSubmit={handleSubmit}>
                    <textarea
                      disabled={loading || !accessToken}
                      onKeyDown={handleEnter}
                      ref={textAreaRef}
                      autoFocus={false}
                      rows={1}
                      maxLength={512}
                      id="userInput"
                      name="userInput"
                      placeholder={
                        loading
                          ? "Waiting for response..."
                          : !accessToken
                          ? "YOU MUST SIGN IN FIRST"
                          : "Type your question..."
                      }
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      className="textarea"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="generatebutton"
                    >
                      {loading ? (
                        <div className="loadingwheel">
                          <CircularProgress color="inherit" size={20} />{" "}
                        </div>
                      ) : (
                        // Send icon SVG in input field
                        <svg
                          viewBox="0 0 20 20"
                          className="svgicon"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                        </svg>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </main>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
