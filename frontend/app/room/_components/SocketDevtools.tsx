import { useSocket } from "@/provider/websocket";

type Props = {
    showTool?: boolean;
};

const Button = ({
    onClick,
    children,
}: {
    onClick: () => void;
    children: React.ReactNode;
}) => {
    return (
        <button
            onClick={onClick}
            className="px-3 py-2 rounded bg-gray-800 text-white"
        >
            {children}
        </button>
    );
};

const SocketDevTools = ({ showTool = false }: Props) => {
    if (!showTool) return null;
    const { sendMessage } = useSocket()
    const handleTestMessage = () => {
        console.log("Sending TEST message");
        sendMessage({ type: "TEST", content: { message: "Hello Im test" } })
    };
    const handleJoinMessage = () => {
        console.log("Joining Room");
        sendMessage({ type: "JOIN", content: { unique_user_id: "WHXIHX", "name": "UNKNOWN" } })
    };

    return (
        <div className="fixed bottom-4 right-4 flex flex-col gap-2">
            <Button onClick={handleTestMessage}>
                Send Test Message
            </Button>
            <Button onClick={handleJoinMessage}>
                Join Room
            </Button>
        </div>
    );
};

export default SocketDevTools;