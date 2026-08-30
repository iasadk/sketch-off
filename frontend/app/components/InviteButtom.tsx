import toast from "react-hot-toast";

const InviteButton = () => {
    const successToast = () => toast("Link Copied", {
        icon: 'ℹ️'
    })
    const handleInvite = async () => {
        await navigator.clipboard.writeText(window.location.href);
        successToast()
    };

    return (
        <button
            type="button"
            onClick={handleInvite}
            className="
        flex 
        ml-auto
        items-center 
        gap-2
        rounded-md 
        border
        border-black
        bg-white 
        px-4 py-1
        hover:bg-black/10
        cursor-pointer
        text-sm 
        font-bold text-black
        transition-all duration-200
        hover:shadow-md
      "
        >
            <span className="text-base">🔗</span>
            Invite
        </button>
    );
};

export default InviteButton;