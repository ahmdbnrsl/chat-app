import React from 'react';
import Avatar from 'react-avatar';

interface ProfileAvatarProps {
    username: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
    name
}: {
    name: string;
}) => {
    return (
        <Avatar
            name={name}
            size='50'
            round={true}
        />
    );
};

const ProfileAvatar2: React.FC<ProfileAvatarProps> = ({
    name
}: {
    name: string;
}) => {
    return (
        <Avatar
            name={name}
            size='35'
            round={true}
        />
    );
};

export { ProfileAvatar, ProfileAvatar2 };
