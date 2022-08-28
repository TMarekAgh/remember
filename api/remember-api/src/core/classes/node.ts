export class Node {
    public static hasAccess(node: any, userId: string) {
        return node.permissions.includes(userId);
    }
}