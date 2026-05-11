import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    HeaderComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

  users: any[] = [];
  selectedUser: any = null;
  isCreateMode: boolean = false;

  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.usersService.getUsers().subscribe(data => {
      this.users = data;
    });
  }

  openCreate() {
    this.isCreateMode = true;

    this.selectedUser = {
      name: '',
      email: '',
      passwordHash: '',
      role: 'User'
    };
  }

  editUser(user: any) {
    this.isCreateMode = false;
    this.selectedUser = { ...user };
  }

  closeForm() {
    this.selectedUser = null;
    this.isCreateMode = false;
  }

  saveUser() {

    if (this.isCreateMode) {

      this.usersService.createUser(this.selectedUser)
        .subscribe(() => {
          this.closeForm();
          this.loadUsers();
        });

    } else {

      this.usersService.updateUser(this.selectedUser.id, this.selectedUser)
        .subscribe(() => {
          this.closeForm();
          this.loadUsers();
        });

    }
  }

  deleteUser(id: number) {
    this.usersService.deleteUser(id).subscribe(() => {
      this.loadUsers();
    });
  }
}