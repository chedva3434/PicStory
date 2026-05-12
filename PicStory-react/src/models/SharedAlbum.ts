import { ReactNode } from "react";

export type SharedAlbum = {
    user: any;
    title: ReactNode;
    ownerName: string;
    owner: ReactNode;
    name: ReactNode;
    email: string;
    Id: number;
    AlbumId: number;
    UserId: number;
    Permissions: string;
    CreatedAt: string;
    Album: {
        Id: number;
        Name: string;
        Description: string;
        UserId: number;
        User: {
            Id: number;
            Email: string;
        };
    };
};
