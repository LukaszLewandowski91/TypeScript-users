const inquirer = require("inquirer");
const consola = require("consola");

enum Action {
  List = "list",
  Add = "add",
  Remove = "remove",
  Quit = "quit",
  Edit = "edit",
}

enum MessageVariant {
  Success = "success",
  Error = "error",
  Info = "info",
}

type InquirerAnswers = {
  action: Action;
};
const startApp = () => {
  inquirer
    .prompt([
      {
        name: "action",
        type: "input",
        message: "How can I help you?",
      },
    ])
    .then(async (answers: InquirerAnswers) => {
      switch (answers.action) {
        case Action.List:
          users.showAll();
          break;
        case Action.Add:
          const user = await inquirer.prompt([
            {
              name: "name",
              type: "input",
              message: "Enter name",
            },
            {
              name: "age",
              type: "number",
              message: "Enter age",
            },
          ]);
          users.add(user);
          break;
        case Action.Remove:
          const name = await inquirer.prompt([
            {
              name: "name",
              type: "input",
              message: "Enter name",
            },
          ]);
          users.remove(name.name);
          break;
        case Action.Edit:
          const userName = await inquirer.prompt([
            {
              name: "name",
              type: "input",
              message: "Enter name for edit",
            },
          ]);
          const newUserData = await inquirer.prompt([
            {
              name: "name",
              type: "input",
              message: "Enter new name",
            },
            {
              name: "age",
              type: "number",
              message: "Enter new age",
            },
          ]);
          users.edit(userName.name, newUserData);
          break;
        case Action.Quit:
          Message.showColorized(MessageVariant.Info, "Bye bye!");
          return;
        default:
          Message.showColorized(MessageVariant.Error, "Command not found");
      }

      startApp();
    });
};

class Message {
  private content: string;
  constructor(content: string) {
    this.content = content;
  }
  public show(): void {
    console.log(this.content);
  }
  public capitalize(): void {
    this.content = this.content.charAt(0).toUpperCase() + this.content.slice(1);
  }
  public toUpperCase(): void {
    this.content = this.content.toUpperCase();
  }
  public toLowerCase(): void {
    this.content = this.content.toLowerCase();
  }
  static showColorized(option: MessageVariant, content: string): void {
    switch (option) {
      case MessageVariant.Success:
        consola.success(content);
        break;
      case MessageVariant.Error:
        consola.error(content);
        break;
      case MessageVariant.Info:
        consola.info(content);
        break;
    }
  }
}
interface User {
  name: string;
  age: number;
}

class UsersData {
  data: User[] = [];
  public showAll(): void {
    Message.showColorized(MessageVariant.Info, "Users data");
    if (this.data.length !== 0) {
      console.table(this.data);
    } else {
      console.log("no data...");
    }
  }
  public add(user: User): void {
    if (
      typeof user.age === "number" &&
      user.age > 0 &&
      typeof user.name === "string" &&
      user.name.length > 0
    ) {
      this.data.push(user);
      Message.showColorized(
        MessageVariant.Success,
        "User has been successfully added!"
      );
    } else {
      Message.showColorized(MessageVariant.Error, "Wrong data!");
    }
  }
  public remove(userName: string): void {
    const userIndex = this.data.findIndex((user) => user.name === userName);

    if (userIndex !== -1) {
      this.data.splice(userIndex, 1);
      Message.showColorized(MessageVariant.Success, "User deleted!");
    } else {
      Message.showColorized(MessageVariant.Error, "User not found");
    }
  }
  public edit(userEdit: string, newUserData: User): void {
    const userIndex = this.data.findIndex((user) => user.name === userEdit);
    if (userIndex !== -1) {
      if (
        typeof newUserData.age === "number" &&
        newUserData.age > 0 &&
        typeof newUserData.name === "string" &&
        newUserData.name.length > 0
      ) {
        this.data = this.data.map((user) =>
          user.name === userEdit ? { ...user, ...newUserData } : user
        );

        Message.showColorized(MessageVariant.Success, "User updated");
      } else {
        Message.showColorized(MessageVariant.Error, "Wrong data");
      }
    } else {
      Message.showColorized(MessageVariant.Error, "User not found");
    }
  }
}
const users = new UsersData();
console.log("\n");
console.info("???? Welcome to the UsersApp!");
console.log("====================================");
Message.showColorized(MessageVariant.Info, "Available actions");
console.log("\n");
console.log("list – show all users");
console.log("add – add new user to the list");
console.log("remove – remove user from the list");
console.log("edit - update user data from the list");
console.log("quit – quit the app");
console.log("\n");

startApp();
