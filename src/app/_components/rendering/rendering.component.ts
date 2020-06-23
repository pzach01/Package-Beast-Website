import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, Output } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Shipment } from 'src/app/_models/shipment';
import { ActivatedRoute } from '@angular/router';
import { Item } from 'src/app/_models/item';
import { Container } from 'src/app/_models/container';
import { MeshLine, MeshLineMaterial } from 'threejs-meshline'

@Component({
  selector: 'app-rendering',
  templateUrl: './rendering.component.html',
  styleUrls: ['./rendering.component.scss']
})
export class RenderingComponent implements OnInit, AfterViewInit {
  vhPercent = .6
  @ViewChild('rendererContainer') rendererContainer: ElementRef;
  @Input() items: Item[];
  @Input() container: Container;
  clickedItem: Item;
  shipment: Shipment;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  scene = new THREE.Scene();;
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / (this.vhPercent * window.innerHeight), 1, 10000);
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  controls = new OrbitControls(this.camera, this.renderer.domElement);
  shipmentId: number;
  threeJSItemMeshes = [];
  itemColors: string[] = ["#FFFF00", "#FB9404", "#ED0F71", "#742E8F", "#5987C5", "#02C3F3", "#00A55D", "#1B4279"];
  step: number;
  totalSteps: number;
  shownMeshes = [];
  hiddenMeshes = [];
  shownMeshLines = [];
  hiddenMeshLines = [];

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.step = this.items.length
    this.totalSteps = this.items.length;
    console.log("items from renderingComponent", this.items)

    //this.items = this.items.filter(item => item.container == this.container.id)
    console.log("container from renderingComponent", this.container)
    this.route.params.subscribe(params => {
      this.shipmentId = +params['id']; // (+) converts string 'id' to a number
      console.log("shipmentId", this.shipmentId)
    })

  }

  ngAfterViewInit() {
    this.renderer.setSize(window.innerWidth, this.vhPercent * window.innerHeight);
    this.renderer.setClearColor(0xffffff, 1);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
    this.generateItemCubes();
    this.generateLights();
    this.generateContainerCube();
    this.setCameraAndControls();
    this.animate();
    this.rendererContainer.nativeElement
      .addEventListener('mousedown', this.onMouseOrTouch.bind(this));
    this.rendererContainer.nativeElement
      .addEventListener('touchstart', this.onMouseOrTouch.bind(this));

  }


  animate() {
    this.hiddenMeshes.forEach(hiddenMesh => {
      if (hiddenMesh.position.y < 2 * this.container.xDim + hiddenMesh.userData.xDim / 2) {
        hiddenMesh.position.y = hiddenMesh.position.y + .1
      } else {
        hiddenMesh.visible = false
      }
    });

    this.shownMeshes.forEach(shownMesh => {
      shownMesh.visible = true
      if (shownMesh.position.y >= shownMesh.userData.xCenter + .1) {
        shownMesh.position.y = shownMesh.position.y - .1
      } else {
        shownMesh.position.y = shownMesh.userData.xCenter
      }
    });

    window.requestAnimationFrame(() => this.animate());
    // this.mesh.rotation.x += 0.01;
    // this.mesh.rotation.y += 0.02;
    this.renderer.render(this.scene, this.camera);
  }

  generateItemCubes() {
    var axesHelper = new THREE.AxesHelper(30);
    this.scene.add(axesHelper)
    this.items.forEach((item, index) => {
      console.log("shippy", item)
      const geometry = new THREE.BoxGeometry(item.yDim, item.xDim, item.zDim);

      var randomColor = this.itemColors[index % this.itemColors.length]
      let material = new THREE.MeshPhongMaterial({ color: randomColor, specular: 0x555555, shininess: 120, wireframe: false, side: THREE.DoubleSide, transparent: true, opacity: .9 });
      let mesh = new THREE.Mesh(geometry, material);
      this.generateLine(mesh, item);
      mesh.position.x = item.yCenter
      mesh.position.y = item.xCenter + item.xDim / 2 * index
      mesh.position.z = item.zCenter

      mesh.name = item.id.toString();
      mesh.userData = item;

      console.log("mmm", mesh)

      this.scene.add(mesh);
      this.threeJSItemMeshes.push(mesh)
      this.shownMeshes.push(mesh)

    });
  }

  generateLine(mesh, item) {
    const v1 = new THREE.Vector3(mesh.position.x - item.yDim / 2, mesh.position.y - item.xDim / 2, mesh.position.z - item.zDim / 2)
    const v2 = new THREE.Vector3(mesh.position.x + item.yDim / 2, mesh.position.y - item.xDim / 2, mesh.position.z - item.zDim / 2)
    const v3 = new THREE.Vector3(mesh.position.x - item.yDim / 2, mesh.position.y + item.xDim / 2, mesh.position.z - item.zDim / 2)
    const v4 = new THREE.Vector3(mesh.position.x - item.yDim / 2, mesh.position.y - item.xDim / 2, mesh.position.z + item.zDim / 2)
    const v5 = new THREE.Vector3(mesh.position.x + item.yDim / 2, mesh.position.y + item.xDim / 2, mesh.position.z - item.zDim / 2)
    const v6 = new THREE.Vector3(mesh.position.x + item.yDim / 2, mesh.position.y - item.xDim / 2, mesh.position.z + item.zDim / 2)
    const v7 = new THREE.Vector3(mesh.position.x - item.yDim / 2, mesh.position.y + item.xDim / 2, mesh.position.z + item.zDim / 2)
    const v8 = new THREE.Vector3(mesh.position.x + item.yDim / 2, mesh.position.y + item.xDim / 2, mesh.position.z + item.zDim / 2)

    mesh.add(this.drawLineFromVertices(v1, v3, "white", 0.05))
    mesh.add(this.drawLineFromVertices(v1, v4, "white", 0.05))
    mesh.add(this.drawLineFromVertices(v2, v5, "white", 0.05))
    mesh.add(this.drawLineFromVertices(v2, v6, "white", 0.05))
    mesh.add(this.drawLineFromVertices(v3, v5, "white", 0.05))
    mesh.add(this.drawLineFromVertices(v3, v7, "white", 0.05))
    mesh.add(this.drawLineFromVertices(v4, v6, "white", 0.05))
    mesh.add(this.drawLineFromVertices(v4, v7, "white", 0.05))
    mesh.add(this.drawLineFromVertices(v5, v8, "white", 0.05))
    mesh.add(this.drawLineFromVertices(v7, v8, "white", 0.05))
    mesh.add(this.drawLineFromVertices(v6, v8, "white", 0.05))
  }

  drawLineFromVertices(v1, v2, color, lineWidth) {
    const vertices = [v1, v2]
    const line = new MeshLine();
    line.setVertices(vertices);
    const lineMaterial = new MeshLineMaterial({ color: new THREE.Color(color), useMap: 0, lineWidth: lineWidth })
    return new THREE.Mesh(line, lineMaterial)

  }

  generateContainerCube() {
    const lineWidth = .1
    const v1 = new THREE.Vector3(0, 0, 0)
    const v2 = new THREE.Vector3(this.container.yDim, 0, 0)
    const v3 = new THREE.Vector3(0, this.container.xDim, 0)
    const v4 = new THREE.Vector3(0, 0, this.container.zDim)
    const v5 = new THREE.Vector3(this.container.yDim, this.container.xDim, 0)
    const v6 = new THREE.Vector3(this.container.yDim, 0, this.container.zDim)
    const v7 = new THREE.Vector3(0, this.container.xDim, this.container.zDim)
    const v8 = new THREE.Vector3(this.container.yDim, this.container.xDim, this.container.zDim)
    this.scene.add(this.drawLineFromVertices(v1, v2, "black", lineWidth))
    this.scene.add(this.drawLineFromVertices(v1, v3, "black", lineWidth))
    this.scene.add(this.drawLineFromVertices(v1, v4, "black", lineWidth))
    this.scene.add(this.drawLineFromVertices(v2, v5, "black", lineWidth))
    this.scene.add(this.drawLineFromVertices(v2, v6, "black", lineWidth))
    this.scene.add(this.drawLineFromVertices(v3, v5, "black", lineWidth))
    this.scene.add(this.drawLineFromVertices(v3, v7, "black", lineWidth))
    this.scene.add(this.drawLineFromVertices(v4, v6, "black", lineWidth))
    this.scene.add(this.drawLineFromVertices(v4, v7, "black", lineWidth))
    this.scene.add(this.drawLineFromVertices(v5, v8, "black", lineWidth))
    this.scene.add(this.drawLineFromVertices(v6, v8, "black", lineWidth))
    this.scene.add(this.drawLineFromVertices(v7, v8, "black", lineWidth))
  }

  generateLights() {
    var light = new THREE.DirectionalLight(0xffffff, .1);
    light.position.set(this.container.yDim, this.container.xDim, this.container.zDim).normalize();
    this.scene.add(light);

    var light3 = new THREE.DirectionalLight(0xffffff, .1);
    light.position.set(0, 0, 0).normalize();
    this.scene.add(light3);

    var light2 = new THREE.AmbientLight(0x404040, 3); // soft white light
    this.scene.add(light2);
  }

  setCameraAndControls() {
    const cameraZPosition = Math.max(this.container.yDim, this.container.xDim, this.container.zDim)
    this.camera.position.z = 1.5 * cameraZPosition;
    this.camera.position.x = this.container.yDim;
    this.camera.position.y = this.container.xDim;
    this.controls.target = new THREE.Vector3(this.container.yDim / 2, this.container.xDim / 2, this.container.zDim / 2);
    this.controls.update();
  }

  resetView() {
    this.setCameraAndControls()
    this.shownMeshes = this.shownMeshes.concat(this.hiddenMeshes)
    this.hiddenMeshes = []
    this.shownMeshes.forEach(mesh => mesh.position.y = mesh.userData.xCenter)
    this.step = this.totalSteps;
  }

  previousItem() {
    if (this.step > 1) {
      this.step--
      const poppedMesh = this.shownMeshes.pop()
      this.hiddenMeshes.unshift(poppedMesh)
    } else {
      this.step = this.totalSteps
      const poppedMesh = this.shownMeshes.pop()
      this.hiddenMeshes.unshift(poppedMesh)
      this.shownMeshes = this.hiddenMeshes
      this.hiddenMeshes = []
    }
  }

  nextItem() {
    if (this.step < this.totalSteps) {
      this.step++
      const poppedMesh = this.hiddenMeshes.shift()
      this.shownMeshes.push(poppedMesh)
    } else {
      this.step = 1
      this.hiddenMeshes = this.shownMeshes
      this.shownMeshes = [this.hiddenMeshes.shift()]
    }
  }

  onMouseOrTouch(event) {
    console.log(event.type);

    if (event.type == "touchstart") {
      var rect = event.target.getBoundingClientRect();
      var x = event.targetTouches[0].pageX - rect.left;
      var y = event.targetTouches[0].pageY - rect.top;
      this.mouse.x = (x / window.innerWidth) * 2 - 1;
      this.mouse.y = - (y / (this.vhPercent * window.innerHeight)) * 2 + 1;
    } else if (event.type == "mousedown") {
      this.mouse.x = (event.offsetX / window.innerWidth) * 2 - 1;
      this.mouse.y = - (event.offsetY / (this.vhPercent * window.innerHeight)) * 2 + 1;
    }

    console.log(this.mouse)
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // calculate objects intersecting the picking ray
    let intersects = this.raycaster.intersectObjects(this.shownMeshes);
    let clickedObject = intersects[0];

    // set all items back to original color
    this.threeJSItemMeshes.forEach((threeJSitemMesh, index) => {
      threeJSitemMesh.material.color.set(this.itemColors[index % this.itemColors.length])
      this.clickedItem = null;
    });

    // //set edges back to original color
    this.shownMeshes.forEach((shownMesh) => {
      shownMesh.children.forEach(meshline => {
        meshline.material.color.set("white")
      });
    })


    if (intersects.length != 0) {
      // set clicked item to color
      //@ts-ignore
      clickedObject.object.material.color.set("#ff0000");
      this.clickedItem = this.items.filter(item => item.id == +clickedObject.object.name)[0]
      console.log("clicked item:", this.clickedItem)
      console.log("userdata", clickedObject.object.userData)

      // set similar item colors to red
      this.shownMeshes.forEach(shownMesh => {
        if (shownMesh.userData.masterItemId == this.clickedItem.masterItemId) {
          shownMesh.children.forEach(meshline => {
            meshline.material.color.set("#ff0000")
          });
        }
      });
    }
  }
}