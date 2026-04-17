import { IoIosArrowBack, IoIosArrowForward, IoMdDownload } from "react-icons/io";
import { IoArrowRedoOutline, IoClose } from "react-icons/io5";
import { FaShuffle, FaBars, FaHouse, FaRegTrashCan, FaPlay, FaPause } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { BiLike, BiDislike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { BsPinAngle, BsPinAngleFill, BsPencil } from "react-icons/bs";
import { MdPlaylistPlay, MdPlaylistAdd, MdOutlinePlaylistRemove, MdOutlinePlaylistAddCheck, MdExplore  } from "react-icons/md";
import { CiVolumeHigh, CiVolumeMute } from "react-icons/ci";
import { AiFillSound } from "react-icons/ai";


export const Icons = {
    Shuffle: FaShuffle,
    Share: IoArrowRedoOutline,
    PreviousPage: IoIosArrowBack,
    NextPage: IoIosArrowForward,
    Bars: FaBars,
    Home: FaHouse,
    Explore: MdExplore,
    Library: MdOutlinePlaylistAddCheck,
    Options: HiDotsVertical,
    Play: FaPlay,
    Pause: FaPause,
    Like: BiLike,
    Liked: BiSolidLike,
    Dislike: BiDislike,
    DisLiked: BiSolidDislike,
    Download: IoMdDownload,
    Close: IoClose,
    Playlist: MdPlaylistPlay,
    PlaylistAdd: MdPlaylistAdd,
    PlaylistRemove: MdOutlinePlaylistRemove,
    User: FaRegUser,
    Pin: BsPinAngle,
    FillPin: BsPinAngleFill,
    Trash: FaRegTrashCan,
    Mute: CiVolumeMute,
    Volume: CiVolumeHigh,
    Pencil: BsPencil,
    Sound: AiFillSound
};