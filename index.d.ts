declare module '@pusher/chatkit-client' {
  interface TokenProviderConfig {
    url: string;
    queryParams?: object;
    headers?: object;
    withCredentials?: boolean;
  }

  export class TokenProvider {
    constructor(options: TokenProviderConfig);
  }

  interface LogFunction {
    (...args: any[]): void;
  }

  interface Logger {
    verbose: LogFunction;
    debug: LogFunction;
    info: LogFunction;
    warn: LogFunction;
    error: LogFunction;
  }

  interface ChatManagerConfig {
    instanceLocator: string;
    userId: string;
    tokenProvider: TokenProvider;
    logger?: Logger;
    connectionTimeout?: number;
  }

  interface ConnectionHooks {
    onAddedToRoom?: (room: Room) => any;
    onRemovedFromRoom?: (room: Room) => any;
    onRoomUpdated?: (room: Room) => any;
    onRoomDeleted?: (room: Room) => any;
    onUserStartedTyping?: (room: Room, user: User) => any;
    onUserStoppedTyping?: (room: Room, user: User) => any;
    onUserJoinedRoom?: (room: Room, user: User) => any;
    onUserLeftRoom?: (room: Room, user: User) => any;
    onPresenceChanged?: (state: PresenceStateChange, user: User) => any;
    onNewReadCursor?: (cursor: Cursor) => any;
  }

  export class ChatManager {
    constructor(otions: ChatManagerConfig);

    connect(hooks?: ConnectionHooks): Promise<CurrentUser>;
    disconnect(): void;
  }

  interface Room {
    id: string;
    isPrivate: boolean;
    name: string;
    users?: User[];
    unreadCount?: number;
    lastMessageAt?: string;
    customData: object;
  }

  interface User {
    id: string;
    name: string;
    avatarURL: string;
    presence: { state: Presence };
    customData?: any;
  }

  interface PresenceStateChange {
    previous: Presence;
    current: Presence;
  }

  type Presence = 'online' | 'offline';

  interface ReadCursorArguments {
    roomId: string;
    userId?: string;
  }

  interface SendMessageArguments {
    text: string;
    roomId: string;
    attachment?: {
      file?: File;
      link?: string;
      type?: 'image' | 'video' | 'audio' | 'file';
      name?: string;
    };
  }

  type MessageFetchDirection = 'older' | 'newer';

  interface FetchMultipartMessagesArguments {
    roomId: string;
    initialId?: number;
    limit?: number;
    direction?: MessageFetchDirection;
  }

  interface IsTypingInArguments {
    roomId: string;
  }

  interface CurrentUser {
    id: string;
    name: string;
    rooms: Room[];
    users: User[];
    roomSubscriptions: {
      [roomId: string]: RoomSubscription;
    };
    subscribeToRoomMultipart(config: SubscribeToRoomConfig): Promise<Room>;
    sendMultipartMessage(message: MultipartMessageRequest): Promise<number>;
    setReadCursor(args: SetReadCursorArguments): Promise<void>;
    readCursor(args: ReadCursorArguments): Cursor;
    // @deprecated
    sendMessage(args: SendMessageArguments): Promise<any>;
    fetchMultipartMessages(args: FetchMultipartMessagesArguments): Promise<any[]>;
    isTypingIn(args: IsTypingInArguments): Promise<void>;
  }

  interface InlineMessagePart {
    partType: 'inline';
    payload: { type: string; content: string };
  }

  interface UrlMessagePart {
    partType: 'url';
    payload: { type: string; url: string };
  }

  interface AttachmentMessagePart {
    partType: 'attachment';
    payload: {
      type: string;
      name: string;
      size: number;
      customData: any;
      url: () => Promise<string>;
      urlExpiry: () => Date;
    };
  }

  type MessagePart = InlineMessagePart | UrlMessagePart | AttachmentMessagePart;

  interface Message {
    id: number;
    sender: User;
    senderId: string;
    room: Room;
    createdAt: string;
    updatedAt: string;
    parts: MessagePart[];
  }

  interface SubscribeToRoomConfig {
    roomId: string;
    messageLimit?: number;
    hooks?: {
      onMessage?: (message: Message) => any;
      onMessageDeleted?: (messageId: number) => any;
      onUserStartedTyping?: (user: User) => any;
      onUserStoppedTyping?: (user: User) => any;
      onUserJoined?: (user: User) => any;
      onUserLeft?: (user: User) => any;
      onPresenceChanged?: (state: PresenceStateChange, user: User) => any;
      onNewReadCursor?: (cursor: Cursor) => any;
    };
  }

  interface RoomSubscription {
    cancel: () => void;
  }

  interface SendInlineMessagePart {
    type: string;
    content: string;
  }

  interface SendUrlMessagePart {
    type: string;
    url: string;
  }

  interface SendAttachmentMessagePart {
    file: Blob;
    type: string;
    name: string;
    customData: any;
  }

  type SendMessagePart =
    | SendInlineMessagePart
    | SendUrlMessagePart
    | SendAttachmentMessagePart;

  interface MultipartMessageRequest {
    roomId: string;
    parts: SendMessagePart[];
  }

  interface Cursor {
    position: number;
    updatedAt: string;
    room: Room;
    user: User;
    type: number;
  }

  interface SetReadCursorArguments {
    roomId: string;
    position: number;
  }

  interface BasicRoom {
    createdAt: string;
    createdByUserId: string;
    id: string;
    isPrivate: boolean;
    name: string;
    updatedAt: string;
    customData?: any;
    deletedAt: string;
    unreadCount: number;
    lastMessageAt: string;
  }

  interface BasicCursor {
    position: number;
    updatedAt: string;
    userId: string;
    roomId: string;
    type: 0;
  }
}
