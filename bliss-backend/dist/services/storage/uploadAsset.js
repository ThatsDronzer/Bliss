export async function uploadAsset(payload) {
    try {
        const data = new FormData();
        data.append('file', payload.file);
        data.append('fileId', payload.fileName);
        if (payload.folderName) {
            data.append('folderName', payload.folderName);
        }
        const url = 'https://storage.nxtjob.ai/upload';
        const response = await fetch(url, {
            method: 'PUT',
            body: data,
            redirect: 'follow',
        });
        const result = await response.json();
        console.log('🚀 ~ uploadAsset ~ result:', result);
        if (result.status === 'success')
            return result.data.url;
        throw new Error('Failed to upload file');
    }
    catch (error) {
        console.log('🚀 ~ uploadAsset ~ error:', error);
        throw error; // rethrow the error to propagate it further
    }
}
//# sourceMappingURL=uploadAsset.js.map