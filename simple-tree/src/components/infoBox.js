export class TreeInfoBox extends HTMLElement {


    //  size:      Total count of the nodes of the Tree
    //  height:    Highest number of child level in the tree (regardless of the left or right sub tree)  
    //  width:     Estimated overall width, in node unit, of the tree (from the lowest left most child to the lowest right most child)
    //  fontcolor: CSS color to be applied to the text displayed when the component is rendered
    //
    static get observedAttributes() {
        return ['size','height','width','fontcolor'];
                        
    }

    connectedCallback() {
                
        this.drawComponent();
    }

    attributeChangedCallback(name, oldval, newval) {

        // if (name === 'size' && oldval !== newval ) {
        //     //this.doSearch();
        //     console.log(`attributeChangedCallback size changed from *** ${oldval} *** to ### ${newval} ### `);
        // }

        // if (name === 'height' && oldval !== newval ) {
        //     //this.doSearch();
        //     console.log(`attributeChangedCallback height changed from *** ${oldval} *** to ### ${newval} ### `);
        // }

        // if (name === 'width' && oldval !== newval ) {
        //     //this.doSearch();
        //     console.log(`attributeChangedCallback width changed from *** ${oldval} *** to ### ${newval} ### `);
        // }

        // if (name === 'fontcolor' && oldval !== newval ) {
        //     //this.doSearch();
        //     console.log(`attributeChangedCallback fontcolor changed from *** ${oldval} *** to ### ${newval} ### `);
        // }

        this.drawComponent();
    }


    // All the rendering of the Web Component is centralized in this method...
    drawComponent() {

        const componentAttributes = this.attributes;
        const params = {
            size:        this.hasAttribute("size")       ? componentAttributes.size.value : 0, 
            height:      this.hasAttribute("height")     ? componentAttributes.height.value : 0,
            width:       this.hasAttribute("width")      ? componentAttributes.width.value : 0            
        };

       this.innerHTML =  this.createGrid( params );
       this.style.color = this.hasAttribute("fontcolor")  ? componentAttributes.fontColor.value : "#ffffff";
    }


    createGrid( params ) {

        return  `<table class='table-infoBox'>
                    <tr>
                        <td class='td-infoBox'>Size</td>
                        <td class='td-infoBox'>${params.size}</td>
                    </tr>
                    <tr>
                        <td class='td-infoBox'>Height</td>
                        <td class='td-infoBox'>${params.height}</td>
                    </tr>
                    <tr>
                        <td class='td-infoBox'>Width</td>
                        <td class='td-infoBox'>${params.width}</td>
                    </tr>
                </table>`;
    }

}


customElements.define('tree-info-box', TreeInfoBox);
console.log("Component tree-info-box is registered!");
