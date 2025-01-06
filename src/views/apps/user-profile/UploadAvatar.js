import React, { useState } from 'react';
import { Avatar, IconButton, Input, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { PhotoCamera } from '@mui/icons-material';

const StyledAvatarContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    display: 'inline-block',
}));

const UploadAvatar = ({ avatarData, setAvatarData, h, w }) => {
    const [error, setError] = useState('');

    const handleUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png'];
            if (allowedTypes.includes(file.type)) {
                // Create a URL for preview
                const imageUrl = URL.createObjectURL(file)
                setAvatarData({
                    preview: imageUrl,
                    file: file
                });
                setError('');
            } else {
                setError('Please upload only JPEG or PNG images.');
                // Clear the input
                event.target.value = '';
            }
        }
    };

    return (
        <div className='overflow-hidden' style={{ width: w ? w : 100, height: h ? h : 100 }}>
            <StyledAvatarContainer>
                <Avatar src={avatarData.preview} sx={{ width: w ? w : 100, height: h ? h : 100 }} />
                <IconButton

                    component="label"
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        padding: '4px',
                        border: '1px solid',
                        borderColor: 'primary.main',
                        '&:hover': {
                            backgroundColor: '#f0f0f0',
                        },
                    }}
                >
                    <input
                        type="file"
                        hidden
                        accept="image/jpeg,image/png"
                        onChange={handleUpload}
                    />
                    <PhotoCamera sx={{ color: 'primary.main', fontSize: 20 }} />
                </IconButton>
            </StyledAvatarContainer>
            {error && (
                <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                    {error}
                </Typography>
            )}
        </div>
    );
};

export default UploadAvatar;