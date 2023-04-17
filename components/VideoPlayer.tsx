import { NextPage } from 'next';
import React, { useState, useRef } from 'react';


type Props = {
    url: string;
};
  
const VideoPlayer: NextPage<Props> = ({
    url,
  }: Props) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const videoRef = useRef<any>(null);

    const togglePlay = () => {
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleProgress = () => {
        const duration = videoRef.current.duration;
        const currentTime = videoRef.current.currentTime;
        const progress = (currentTime / duration) * 100;
        setProgress(progress);
    };
    return (
        <div>
            <video
                onTimeUpdate={handleProgress}
                ref={videoRef}
                width="100%"
                height="100%"
                controls
            >
                <source src={url} type="video/mp4" />
            </video>
        </div>
    )
}

export default VideoPlayer;