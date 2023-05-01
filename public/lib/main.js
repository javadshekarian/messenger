class Main{
    static addClass(Element,classNames){
        var classes=classNames.split(' ');
        classes.forEach(className=>{
            Element.classList.add(className);
        })
        return Element;
    }
    static createElem(elementType,classesName,idName,innerContent){
        var elem=document.createElement(elementType);
        if(classesName){
            var classes=classesName.split(' ');
            classes.forEach(className=>{
                elem.classList.add(className);
            });
        }
        if(idName){
            elem.id=idName;
        };
        if(innerContent){
            elem.innerHTML=innerContent;
        }
        return elem;
    }
    static createInput(classesName,idName,type,placeholderContent){
        var inp=document.createElement('input');
        inp.type=type;
        inp.placeholder=placeholderContent;
        if(classesName){
            var classes=classesName.split(' ');
            classes.forEach(className=>{
                inp.classList.add(className);
            });
        }
        if(idName){
            inp.id=idName;
        }
        return inp;
    }
    static createBtn(type,classesName,innerContent,idName){
        var btn=document.createElement('button');
        btn.type=type;
        var classes=classesName.split(' ');
        classes.forEach(className=>{
            btn.classList.add(className);
        });
        btn.innerHTML=innerContent;
        if(idName){
            btn.id=idName;
        };
        return btn;
    }
}