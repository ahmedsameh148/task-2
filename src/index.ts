import "reflect-metadata";
import {createConnection} from "typeorm";
import {Member} from "./entity/Member";
import { strict } from "assert";

const express = require('express');
const bodyParser = require('body-parser');




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
        let tmp = await connection.manager.find(Member);
        Members = tmp;
    }
    init();
    app.listen(3000,()=>{
        console.log("The Server Is Listening At Port 3000 ");
    });
    
    app.get('/members',(req: any,res: any)=>{
        res.send(Members);
        init();
    });
    
    app.get('/member/:id',async (req:any , res:any)=>{
        const id = req.params.id;
        let ok = false;
        Members.find((x)=>{
            if(x.id == id){res.send(x); ok = true; return;}
        });
        if(!ok){res.status(400); res.send("Their is No Member With That ID ");}
        init();
    });
    
    app.post('/members',async (req: any, res: any)=>{
        const member: Member = req.body;
        let ok = true;
        Members.find((x)=>{
            if(x.id==member.id){ok = false; return;}
        });
        if(!ok){res.status(400); res.send("This ID Is Already Used "); return;}
        Members.push(member);
        await Member.create({id: member.id, name: member.name, mobile:member.mobile, email:member.email, committee:member.committee}).save();
        
        res.send("The Member Was Added Succecfully");
        init();
    });
    
    app.put('/member/:id',(req:any , res:any)=>{
        const idd = req.params.id;
        const newdata: Member = req.body;
        const check = checkvalidality(Members,newdata.id,(newdata.id==idd)?1:0);
        if(check == 0){
            res.status(400);
            res.send("Their is A Member Already Using The New ID");
            return;
        }
        let ok = false;
        for(let i=0; i<Members.length; i++){
            if(Members[i].id == idd){
                Members[i] = newdata;
                Member.update({id : idd}, newdata);
                ok = true; break;
            }
        }
        if(ok){res.status(201); res.send("The Member Was Edited Succecfully");}
        else {res.status(404); res.send("Their Is No Member With That ID");}
        init();
    });
    
    app.delete('/member/:id',async (req:any , res:any)=>{
        let i;
        const idd = req.params.id;
        for(i=0; i<Members.length; i++){
            if(Members[i].id==idd)break;
        }
        if(i==Members.length){res.status(404); res.send("Their Is No Member With That ID");}
        else {
            Members.splice(i,1); 
            await Member.delete({id:idd});
            res.send("The Member Is Removed Succecfully");
        }
        init();
    });

}).catch(error => console.log(error));
