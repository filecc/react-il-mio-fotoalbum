interface User {
  id: string | null;
  email: string | null;
  name?: string | null;
}

export class PhotoClass {
  title: string;
  description: string;
  visible: boolean;
  categories: string[];
  author?: User;
  link: string

  constructor(
    title: string,
    description: string,
    visible: boolean,
    categories: string[],
    link: string,
    author?: User,
   
  ) {
    this.title = title;
    this.description = description;
    this.visible = visible;
    this.categories = categories;
    this.link = link
    this.author = author;
  }
}
