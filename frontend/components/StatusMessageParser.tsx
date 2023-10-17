import { StatusMessage } from "../types"

type Props = {
    statusMessage: StatusMessage
}

const StatusMessageParser: React.FC<Props> = ({statusMessage}) => {
    return (
        <div>
            {statusMessage && (
                <p className={`text-center mb-4 alert ${statusMessage.type === "success" ? "alert-success":"alert-danger"}`}>{statusMessage.message}</p>
            )}
        </div>
    )
}

export default StatusMessageParser