export class Util {
    public static getWindowDimensions(): { width: number; height: number } {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height
        };
    }
}
