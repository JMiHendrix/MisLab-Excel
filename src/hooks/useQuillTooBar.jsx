// 定义工具栏模块
export const useQuillTooBar = () => {
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image', 'video'],
            ['clean']
        ],
        clipboard: {
            // 配置粘贴时的行为
        },
        history: {
            // 配置撤销/重做功能
        }
    };
    
    // 定义工具栏样式
    const formats = [
        'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent', 'link', 'image', 'video', 'clean'
    ];

    return {
        modules,
        formats
    }
}