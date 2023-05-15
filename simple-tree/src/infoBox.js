export class TreeInfoBox extends HTMLElement {


    static get observedAttributes() {
        return ['height','size'];
    }

    connectedCallback() {
        
        const tagAttributes = this.attributes;


        var size      =   ( tagAttributes.getNamedItem("size") !== null )   ? tagAttributes.size.value : 0;
        var height    = ( tagAttributes.getNamedItem("height") !== null ) ? tagAttributes.height.value : 0;
        var width     =  ( tagAttributes.getNamedItem("width") !== null )  ? tagAttributes.width.value : 0;
        var fontColor =  ( tagAttributes.getNamedItem("fontColor") !== null )  ? tagAttributes.fontColor.value : "#ffffff";
        

   
        this.innerHTML = `<p>Size = ${size}</p><p>Height = ${height}</p><p>width = ${width}</p>`;
        

        //this.style.color = "red";
        this.style.color = fontColor;
        
    }

    attributeChangedCallback(name, oldval, newval) {

       
        if (name === 'size' && oldval !== newval ) {
            //this.doSearch();
            console.log(`attributeChangedCallback size changed from *** ${oldval} *** to ### ${newval} ### `);
        }

        if (name === 'height' && oldval !== newval ) {
            //this.doSearch();
            console.log(`attributeChangedCallback height changed from *** ${oldval} *** to ### ${newval} ### `);
        }

        if (name === 'width' && oldval !== newval ) {
            //this.doSearch();
            console.log(`attributeChangedCallback width changed from *** ${oldval} *** to ### ${newval} ### `);
        }

        


    }
}

class Salutation extends HTMLElement {


    static get observedAttributes() {
        return ['username'];
    }

    connectedCallback() {
        
        const tagAttributes = this.attributes;

        var userName = this.attributes.username.value;
        this.innerHTML = `<h1>Hello ${userName}...</h1>`;
        //this.innerHTML = `<h1>Hello World...</h1>`; 

        console.log('this.attributes are:');

        this.style.color = "red";
    }

    attributeChangedCallback(name, oldval, newval) {

       
        if (name === 'username' && oldval !== newval ) {
            //this.doSearch();
            console.log(`attributeChangedCallback changed from *** ${oldval} *** to ### ${newval} ### `);
        }
    }
}


class Hello extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<div><p>Daniel</p></div>`;
    }
}


class Slider extends HTMLElement {
    connectedCallback() {
       this.innerHTML =  '<div class="bg-overlay"></div><div class="thumb"></div>';
       
       this.style.display = 'inline-block';
       this.style.position = 'relative';
       this.style.width = '500px';
       this.style.height = '50px';

      
        this.querySelector('.bg-overlay').style.height = '100%';
        this.querySelector('.bg-overlay').style.position = 'absolute';
        // this.querySelector('.bg-overlay').style.backgroundColor = 'red';
        this.querySelector('.bg-overlay').style.backgroundColor = this.getAttribute('backgroundcolor');

        
        // this.querySelector('.thumb').style.marginLeft = '100px';
        this.querySelector('.thumb').style.marginLeft = this.getAttribute('value') + 'px';

        this.querySelector('.thumb').style.width = '5px';
        //this.querySelector('.thumb').style.height = 'calc(100%- 5px)';
        this.querySelector('.thumb').style.height = '50px';
        
        this.querySelector('.thumb').style.position = 'absolute';
        this.querySelector('.thumb').style.border = '3px solid white';
        this.querySelector('.thumb').style.borderRadius = '3px';

        

    }
}


// customElements.define('salutation-element', Salutation);
customElements.define('hello-element', Hello);
customElements.define('wcia-slider', Slider);