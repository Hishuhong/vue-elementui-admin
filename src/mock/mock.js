import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { LoginUsers,LoginUsers2, Users } from './data/user';
import {Departments} from './data/system';
let _Users = Users;
let _Departments=Departments;

export default {
  /**
   * mock bootstrap
   */
  bootstrap() {
    let mock = new MockAdapter(axios);

    // mock success request
    mock.onGet('/success').reply(200, {
      msg: 'success'
    });

    // mock error request
    mock.onGet('/error').reply(500, {
      msg: 'failure'
    });




    //登录
    mock.onPost('/login').reply(config => {
      let {username, password} = JSON.parse(config.data);
      return new Promise((resolve, reject) => {
        let user = null;
        setTimeout(() => {
          let hasUser = false;
          hasUser= LoginUsers.some(u => {
            if (u.username === username && u.password === password) {
              user = JSON.parse(JSON.stringify(u));
              user.password = undefined;
              return true;
            }
          });

          if(!hasUser){
            hasUser= LoginUsers2.some(u => {
            if (u.username === username && u.password === password) {
              user = JSON.parse(JSON.stringify(u));
              user.password = undefined;
              return true;
            }
            });
          }

          if (hasUser) {
            resolve([200, { code: 200, msg: '请求成功', user }]);
          } else {
            resolve([200, { code: 500, msg: '账号或密码错误' }]);
          }
        }, 1000);
      });
    });


    //获取部门树形数据
    mock.onGet('/system/department/list').reply(config => {
      let deps=depchilren(_Departments,0,'无');

      console.log(deps);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            departments: deps
          }]);
        }, 1000);
      });
    });

    //生成部门数据树递归方法
    function depchilren(data,pid,name){
      var result=[],temp;
      for(var i in data){
        if(data[i].parent_sysno==pid){
          data[i].label=data[i].departmentname;
          data[i].id=data[i].sysno;
          data[i].parent_departmentname=name;
          result.push(data[i]);
          temp=depchilren(data,data[i].sysno,data[i].departmentname);
          if(temp.length>0){
            data[i].children=temp;
          }
        }
      }
      return result;
    }
    //新增部门
    mock.onGet('/system/departments/add').reply(config => {
      let { sysno, parent_sysno, departmentname, status, isdel,version,created_at,updated_at } = config.params;
      _Departments.push({
        sysno: sysno,
        parent_sysno: parent_sysno,
        departmentname: departmentname,
        status: status,
        isdel: isdel,
        version:version,
        created_at:created_at,
        updated_at:updated_at
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '新增成功'
          }]);
        }, 500);
      });
    });
    //删除部门
    mock.onGet('/system/departments/remove').reply(config => {
      let { sysno } = config.params;
      let deps=[];
      _Departments.forEach(function(d){
        if(d.sysno!=sysno){

          deps.push(d);
        }
      });
      
      _Departments = deps;
      console.log(_Departments);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });
  

    //获取用户列表
    mock.onGet('/user/list').reply(config => {
      let {name} = config.params;
      let mockUsers = _Users.filter(user => {
        if (name && user.name.indexOf(name) == -1) return false;
        return true;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            menus: mockUsers
          }]);
        }, 1000);
      });
    });

    //获取用户列表（分页）
    mock.onGet('/user/listpage').reply(config => {
      let {page, name} = config.params;
      let mockUsers = _Users.filter(user => {
        if (name && user.name.indexOf(name) == -1) return false;
        return true;
      });
      let total = mockUsers.length;
      mockUsers = mockUsers.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            users: mockUsers
          }]);
        }, 1000);
      });
    });

    //删除用户
    mock.onGet('/user/remove').reply(config => {
      let { id } = config.params;
      _Users = _Users.filter(u => u.id !== id);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //批量删除用户
    mock.onGet('/user/batchremove').reply(config => {
      let { ids } = config.params;
      ids = ids.split(',');
      _Users = _Users.filter(u => !ids.includes(u.id));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //编辑用户
    mock.onGet('/user/edit').reply(config => {
      let { id, name, addr, age, birth, sex } = config.params;
      _Users.some(u => {
        if (u.id === id) {
          u.name = name;
          u.addr = addr;
          u.age = age;
          u.birth = birth;
          u.sex = sex;
          return true;
        }
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '编辑成功'
          }]);
        }, 500);
      });
    });

    //新增用户
    mock.onGet('/user/add').reply(config => {
      let { name, addr, age, birth, sex } = config.params;
      _Users.push({
        name: name,
        addr: addr,
        age: age,
        birth: birth,
        sex: sex
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '新增成功'
          }]);
        }, 500);
      });
    });

  }
};