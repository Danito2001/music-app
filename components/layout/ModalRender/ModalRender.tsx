import { useUIContext } from "@/context/ui.context"
import ConfigModal from "../../common/ConfigModal/ConfigModal";
import { PlaylistModal } from "../../features/playlist/PlaylistModal";
import { SaveSongModal } from "@/components/features/song/SaveSongModal";


export default function ModalRender() {

    const { activeModal, closeModal } = useUIContext();

    if (!activeModal || activeModal === null) return null;

    switch (activeModal.type) {
        case "config":
            return <ConfigModal onClose={closeModal}/>;
        
        case "saveSong":
            return <SaveSongModal onClose={closeModal} {...activeModal.props}/>;

        case "playlistForm": {
            return <PlaylistModal {...activeModal.props}/>;
        }
    
        default:
            return null;
    }

}