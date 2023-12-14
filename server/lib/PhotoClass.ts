export class PhotoClass {
    title: string;
    description: string;
    visible: boolean;
    categories: string[];

    constructor(title: string, description: string, visible: boolean, categories: string[]) {
        this.title = title;
        this.description = description;
        this.visible = visible;
        this.categories = categories;
    }

    }

