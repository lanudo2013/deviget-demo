export enum PostType {
    IMAGE, VIDEO, LINK, SELF
}

export function fromPostType(val: string) : PostType | null {
    if (val) {
        val = val.toLowerCase();
        switch(val) {
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
    }
    return PostType.IMAGE;
}