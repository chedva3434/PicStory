export type AlbumDTO = {
  id: number;
  userId:number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  photos: string[];  // נניח שזה מערך של תמונות (לפי הצורך תוכל לעדכן את סוג המידע)
  sharedAlbums: string[];
}
