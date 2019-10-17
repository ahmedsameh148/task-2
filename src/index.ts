import "reflect-metadata";
import {createConnection} from "typeorm";
import {members} from "./entity/members";
import { strict } from "assert";

const express = require('express');
const bodyParser = require('body-parser');

class Member{
    public id: number;
    public name: string;
    public email: string;
    public mobile: number;
    public committee: string;

    constructor(id: number, name: string, email: string, mobile: number, committee: string){
        this.id = id;
        this.name = name;
        this.email = email;
        this.mobile = mobile;
        this.committee = committee;

    }
}


createConnection().then(async connection => {

    function checkvalidality(members:Member[], id:number, mx:number){
        let counter = 0;
        members.forEach(i => {
            if(i.id == id)counter++;
        });
        if(counter>mx)return 0;
        return 1;
    }
    
    const app = express();
    let Members : Member[] = [];

    app.use(bodyParser.json([strict , true]));
    
    async function init(){
        let tmp = await connection.manager.find(members);
        Members = tmp;
    }

    app.listen(3000,()=>{
        console.log("The Server Is Listening At Port 3000 ");
    });
    
    app.get('/members',(req: any,res: any)=>{
        res.send(Members);
    });
    
    app.get('/member/:id',async (req:any , res:any)=>{
        const id = req.params.id;
        let ok = false;
        Members.find((x)=>{
            if(x.id == id){res.send(x); ok = true; return;}
        });
        if(!ok){res.status(400); res.send("Their is No Member With That ID ");}
    });
    
    app.post('/members',async (req: any, res: any)=>{
        const member: Member = req.body;
        let ok = true;
        Members.find((x)=>{
            if(x.id==member.id){ok = false; return;}
        });
        if(!ok){res.status(400); res.send("This ID Is Already Used "); return;}
        Members.push(member);
        await members.create({id: member.id, name: member.name, mobile:member.mobile, email:member.email, committee:member.committee}).save();
        members.count().then(()=>{
            console.log()
        });
        res.send("The Member Was Added Succecfully");
        
    });
    
    app.put('/member/:id',(req:any , res:any)=>{
        const id = req.params.id;
        const newdata: Member = req.body;
        const check = checkvalidality(Members,newdata.id,(newdata.id==id)?1:0);
        if(check == 0){
            res.status(400);
            res.send("Their is A Member Already Using The New ID");
            return;
        }
        let ok = false;
        for(let i=0; i<Members.length; i++){
            if(Members[i].id == id){
                Members[i] = newdata;
                ok = true; break;
            }
        }
        if(ok){res.status(201); res.send("The Member Was Edited Succecfully");}
        else {res.status(404); res.send("Their Is No Member With That ID");}
    });
    
    app.delete('/member/:id',(req:any , res:any)=>{
        let i;
        const id = req.params.id;
        for(i=0; i<Members.length; i++){
            if(Members[i].id==id)break;
        }
        if(i==Members.length){res.status(404); res.send("Their Is No Member With That ID");}
        else {
            Members.splice(i,1); 
            res.send("The Member Is Removed Succecfully");
        }
    });

}).catch(error => console.log(error));
