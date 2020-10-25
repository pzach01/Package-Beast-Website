import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, Output } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Shipment } from 'src/app/_models/shipment';
import { ActivatedRoute } from '@angular/router';
import { Item } from 'src/app/_models/item';
import { Container } from 'src/app/_models/container';
import { MeshLine, MeshLineMaterial } from 'threejs-meshline'
import { AuthenticationService } from 'src/app/_services';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-rendering',
  templateUrl: './rendering.component.html',
  styleUrls: ['./rendering.component.scss']
})
export class RenderingComponent implements OnInit, AfterViewInit {
  currentUser = this.authenticationService.currentUserValue;
  vhPercent = .75
  @ViewChild('rendererContainer') rendererContainer: ElementRef;
  @Input() items: Item[];
  @Input() container: Container;
  displayedColumns: string[] = ['index', 'sku', 'description'];


  clickedItem: Item;
  shipment: Shipment;
  dataSource;
  renderer = new THREE.WebGLRenderer({ antialias: true });
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, (.67 * window.innerWidth) / (this.vhPercent * window.innerHeight), 1, 10000);
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  controls = new OrbitControls(this.camera, this.renderer.domElement);
  shipmentId: number;
  threeJSItemMeshes = [];
  itemColors: string[] = ["#FFFF00", "#FB9404", "#CCFFCC", "#742E8F", "#5987C5", "#02C3F3", "#00A55D", "#1B4279"];
  step: number;
  totalSteps: number;
  shownMeshes = [];
  hiddenMeshes = [];
  shownMeshLines = [];
  hiddenMeshLines = [];
  keyCode: number;
  rotSpeed: number = .005;
  initialCameraPositionX: number;
  initialCameraPositionY: number;
  initialCameraPositionZ: number;

  rotationAngle: number = 0;

  constructor(private route: ActivatedRoute, private authenticationService: AuthenticationService) {

  }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe((currentUser) => this.currentUser = currentUser)
    this.step = this.items.length
    this.totalSteps = this.items.length;
    this.dataSource = new MatTableDataSource(this.items);

    //this.items = this.items.filter(item => item.container == this.container.id)
    this.route.params.subscribe(params => {
      this.shipmentId = +params['id']; // (+) converts string 'id' to a number
    })

  }

  ngAfterViewInit() {
    this.renderer.setSize((.67 * window.innerWidth), this.vhPercent * window.innerHeight);
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
    this.rendererContainer.nativeElement.addEventListener('keydown', this.keyDown.bind(this))
  }


  animate() {
    this.hiddenMeshes.forEach(hiddenMesh => {
      if (!this.currentUser.disablePreviousNextItemAnimation) {
        if (hiddenMesh.position.y < 2 * this.container.xDim + hiddenMesh.userData.xDim / 2 + hiddenMesh.userData.xCenter) {
          hiddenMesh.position.y = hiddenMesh.position.y + .25 + this.currentUser.animationSpeed / 100
        } else {
          hiddenMesh.visible = false
        }
      } else {
        hiddenMesh.visible = false
      }
    });

    this.shownMeshes.forEach(shownMesh => {
      shownMesh.visible = true
      if (shownMesh.position.y >= shownMesh.userData.xCenter + .1) {
        shownMesh.position.y = shownMesh.position.y - .25 - this.currentUser.animationSpeed / 100
      } else {
        shownMesh.position.y = shownMesh.userData.xCenter
      }
    });

    this.handleRotateKeys();

    window.requestAnimationFrame(() => this.animate());
    // this.mesh.rotation.x += 0.01;
    // this.mesh.rotation.y += 0.02;

    this.renderer.render(this.scene, this.camera);
  }

  keyDown(event) {
    this.keyCode = event.which;
    console.log("keycode", this.keyCode)
  }

  handleRotateKeys() {
    if ((this.keyCode < 58) && (this.keyCode > 48)) {
      this.rotSpeed = (this.keyCode - 48) * .005
    }

    if (this.keyCode == 39) {
      // this.camera.position.x = this.initialCameraPositionX + Math.cos(this.rotSpeed * this.i);
      // this.camera.position.z = this.initialCameraPositionZ + Math.sin(this.rotSpeed * this.i);

      this.camera.position.x = this.camera.position.x * Math.cos(this.rotSpeed) + this.camera.position.z * Math.sin(this.rotSpeed);
      this.camera.position.z = this.camera.position.z * Math.cos(this.rotSpeed) - this.camera.position.x * Math.sin(this.rotSpeed);
      this.controls.target = new THREE.Vector3(this.container.yDim / 2, this.container.xDim / 2, this.container.zDim / 2);
      this.controls.update();
    }
    if (this.keyCode == 37) {
      // this.camera.rotation.y -= .03
      this.camera.position.x = this.camera.position.x * Math.cos(-this.rotSpeed) + this.camera.position.z * Math.sin(-this.rotSpeed);
      this.camera.position.z = this.camera.position.z * Math.cos(-this.rotSpeed) - this.camera.position.x * Math.sin(-this.rotSpeed);
      this.controls.target = new THREE.Vector3(this.container.yDim / 2, this.container.xDim / 2, this.container.zDim / 2);
      this.controls.update();
    }
    this.keyCode = 0;
  }

  generateItemCubes() {
    var axesHelper = new THREE.AxesHelper(30);
    this.scene.add(axesHelper)
    this.items.forEach((item, index) => {
      if (item.container == this.container.id) {
        const geometry = new THREE.BoxGeometry(item.yDim, item.xDim, item.zDim);
        var randomColor = this.itemColors[index % this.itemColors.length]
        let material = new THREE.MeshPhongMaterial({ color: randomColor, specular: 0x555555, shininess: 120, wireframe: false, side: THREE.DoubleSide, transparent: true, opacity: .9 });
        let mesh = new THREE.Mesh(geometry, material);
        this.generateLine(mesh, item);

        mesh.position.x = item.yCenter
        if (!this.currentUser.disableFillContainerAnimation) {
          mesh.position.y = item.xCenter + item.xDim / 2 * index
        } else {
          mesh.position.y = item.xCenter
        }

        mesh.position.z = item.zCenter
        mesh.name = item.id.toString();
        mesh.userData = item;
        this.scene.add(mesh);
        this.threeJSItemMeshes.push(mesh)
        this.shownMeshes.push(mesh)
      }
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
    this.camera.position.z = 2.5 * cameraZPosition;
    this.camera.position.x = 1.5 * this.container.yDim;
    this.camera.position.y = 1.25 * this.container.xDim;
    this.initialCameraPositionX = this.camera.position.x
    this.initialCameraPositionY = this.camera.position.y
    this.initialCameraPositionZ = this.camera.position.z

    this.controls.target = new THREE.Vector3(this.container.yDim / 2, this.container.xDim / 2, this.container.zDim / 2);
    this.controls.keys = { LEFT: 0, RIGHT: 0, UP: 0, BOTTOM: 0 }
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
    this.rowClicked(this.items[this.step - 1])
    this.scrollToItem(this.items[this.step - 1])

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
    this.rowClicked(this.items[this.step - 1])
    this.scrollToItem(this.items[this.step - 1])

  }

  onMouseOrTouch(event) {
    if (event.type == "touchstart") {
      var rect = event.target.getBoundingClientRect();
      var x = event.targetTouches[0].pageX - rect.left;
      var y = event.targetTouches[0].pageY - rect.top;
      this.mouse.x = (x / (.67 * window.innerWidth)) * 2 - 1;
      this.mouse.y = - (y / (this.vhPercent * window.innerHeight)) * 2 + 1;
    } else if (event.type == "mousedown") {
      this.mouse.x = (event.offsetX / (.67 * window.innerWidth)) * 2 - 1;
      this.mouse.y = - (event.offsetY / (this.vhPercent * window.innerHeight)) * 2 + 1;
    }

    this.raycaster.setFromCamera(this.mouse, this.camera);

    // calculate objects intersecting the picking ray
    let intersects = this.raycaster.intersectObjects(this.shownMeshes);
    let clickedObject = intersects[0];

    this.resetColors()

    if (intersects.length != 0) {
      this.highlightItem(clickedObject.object)
      this.scrollToItem(this.clickedItem)
    }
  }

  resetColors() {
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
  }

  highlightItem(threeJSObject) {

    // set clicked item to color
    //@ts-ignore
    threeJSObject.material.color.set("#ff0000");
    this.clickedItem = this.items.filter(item => item.id == +threeJSObject.name)[0]

    // set similar item colors to red

    // this.shownMeshes.forEach(shownMesh => {
    //   if (shownMesh.userData.masterItemId == this.clickedItem.masterItemId) {
    //     shownMesh.children.forEach(meshline => {
    //       meshline.material.color.set("#ff0000")
    //     });
    //   }
    // });

  }

  rowClicked(item: Item, i?: number) {
    if (i) {
      for (let index = this.step; index < i + 1; index++) {
        this.step++
        const poppedMesh = this.hiddenMeshes.shift()
        this.shownMeshes.push(poppedMesh)
      }
    }
    const selectedMesh = this.shownMeshes.filter(shownMesh => +shownMesh.userData.id == item.id)[0]
    if (selectedMesh) {
      this.resetColors()
      this.highlightItem(selectedMesh)
    }
  }

  scrollToItem(scrollToItem: Item) {
    let index = this.items.findIndex((item) => item.id == scrollToItem.id)
    document.getElementById('table-container').scrollTo(0, index * 48);
  }
}
