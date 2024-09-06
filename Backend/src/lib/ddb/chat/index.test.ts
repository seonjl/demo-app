import { faker } from "@faker-js/faker";
import { randomId } from "../../util";
import { ChatRepository } from "./chat.repository";
import { ChatRoomRepository } from "./chatroom.repository";

// Chat
//   [PK]room_id
//   [SK]created_at
//   message
//   user_email

// ChatRoom
//   [PK]room_id
//   [SK, PK2]user_email
//   [SK2]last_chatted_at
//   last_message
//   badge_count
//   room_name
//   members

describe("chat", () => {
  const chatRepository = new ChatRepository();
  const chatRoomRepository = new ChatRoomRepository();
  const room_id = randomId();
  const user_a = "seonjl.dev@gmail.com";
  const user_b = faker.internet.email();

  test("start chat by A to B", async () => {
    const message = faker.lorem.lines(1);

    await chatRepository.createChat({
      room_id,
      user_email: user_a,
      message: "hello",
    });

    await chatRoomRepository.createChatRoom(
      { room_id, user_email: user_a },
      {
        last_message: message,
        badge_count: 0,
        room_name: user_b,
        members: [user_a, user_b],
      }
    );

    await chatRoomRepository.createChatRoom(
      { room_id, user_email: user_b },
      {
        last_message: message,
        badge_count: 1,
        room_name: user_a,
        members: [user_a, user_b],
      }
    );
  });

  test("and add chat by A", async () => {
    const message = faker.lorem.lines(1);

    await chatRepository.createChat({
      room_id,
      user_email: user_a,
      message,
    });

    await chatRoomRepository.updateChatRoom(
      { room_id, user_email: user_a },
      {
        last_message: message,
        badge_count: 0,
      }
    );

    await chatRoomRepository.updateChatRoom(
      { room_id, user_email: user_b },
      {
        last_message: message,
        badge_count_increment: 1,
      }
    );
  });

  test("list chat by B, and add chat by B", async () => {
    const chatrooms = await chatRoomRepository.listChatRooms(user_b);

    for (const _chatroom of chatrooms) {
      if (_chatroom.room_id === room_id) {
        const chats = await chatRepository.listChats(_chatroom.room_id);
        console.log({ ..._chatroom, chats });

        break;
      }
    }

    const message = faker.lorem.lines(1);

    await chatRepository.createChat({
      room_id,
      user_email: user_b,
      message,
    });

    await chatRoomRepository.updateChatRoom(
      { room_id, user_email: user_b },
      {
        last_message: message,
        badge_count: 0,
      }
    );

    await chatRoomRepository.updateChatRoom(
      { room_id, user_email: user_a },
      {
        last_message: message,
        badge_count_increment: 1,
      }
    );

    const updatedChatrooms = await chatRoomRepository.listChatRooms(user_b);
    for (const _chatroom of updatedChatrooms) {
      if (_chatroom.room_id === room_id) {
        const chats = await chatRepository.listChats(_chatroom.room_id);
        console.log({ ..._chatroom, chats });

        break;
      }
    }
  });

  test("list chat and query", async () => {
    const chats = await chatRepository.listChats("0.94ww.p4spntfox2", {
      Limit: 10,
      ExclusiveStartKey: {
        created_at: "2024-08-06T04:52:03.295Z",
        room_id: "0.94ww.p4spntfox2",
      },
    });
    console.log(chats);
  });
});

describe("ChatRepository", () => {
  const chatRepository = new ChatRepository();
  const chatRoomRepository = new ChatRoomRepository();
  const room_id = "0.81l9.mk86mh6e6zh";
  const user_a = "seonjl.dev@gmail.com";
  const user_b = "Cyrus36@hotmail.com";

  test("and add chat by A", async () => {
    const message = faker.lorem.lines(1);

    await chatRepository.createChat({
      room_id,
      user_email: user_b,
      message,
    });

    await chatRoomRepository.updateChatRoom(
      { room_id, user_email: user_b },
      {
        last_message: message,
        badge_count: 0,
      }
    );

    await chatRoomRepository.updateChatRoom(
      { room_id, user_email: user_a },
      {
        last_message: message,
        badge_count_increment: 1,
      }
    );
  });
});
