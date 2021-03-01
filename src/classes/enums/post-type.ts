export enum PostType {
    IMAGE, VIDEO, LINK, SELF, CONTENT_EMBED
}

export function fromPostType(val: any) : PostType | null {
    if (val) {
        if (val.post_hint) {
            const v = val.post_hint.toLowerCase();
            switch(v) {
                case 'image':
                    return PostType.IMAGE;
                case 'hosted:video':
                    return PostType.VIDEO;
                case 'rich:video':
                    return PostType.CONTENT_EMBED;
                case 'self':
                    return PostType.SELF;
                case 'link':
                    return PostType.LINK;
                default:
                    return null;
            }
        } else if (val.selftext_html) {
            return PostType.SELF;
        } else if (val.is_video) {
            return PostType.VIDEO;
        } else if (val.secure_media && val.secure_media.oembed && val.secure_media.oembed.html) {
            return PostType.CONTENT_EMBED;
        }
        
    }
    return PostType.IMAGE;
}