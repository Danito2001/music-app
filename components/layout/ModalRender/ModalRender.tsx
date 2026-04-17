import { useUIContext } from "@/context/ui.context"
import SaveSongModal from "../../features/song/SaveSongModal/SaveSongModal";
import ConfigModal from "../../common/ConfigModal/ConfigModal";
import { PlaylistModal } from "../../features/playlist/PlaylistModal";


export default function ModalRender() {

    const { activeModal, closeModal } = useUIContext();

    if (!activeModal || activeModal === null) return null;

    switch (activeModal.type) {
        case "config":
            return <ConfigModal onClose={closeModal}/>;
        
        case "saveSong":
            return <SaveSongModal onClose={closeModal} {...activeModal.props}/>;

        case "playlistForm":
            return <PlaylistModal title={activeModal.props?.title ?? ""}/>;
    
        default:
            return null;
    }

}