export enum PostType {
    IMAGE, VIDEO, LINK, SELF
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
                case 'self':
                    return PostType.SELF;
                case 'link':
                    return PostType.LINK;
                default:
                    return null;
            }
        } else if (val.selftext_html) {
            return PostType.SELF;
        }
        
    }
    return PostType.IMAGE;
}