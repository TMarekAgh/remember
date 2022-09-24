import { animate, animateChild, query, sequence, stagger, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NodeType } from '@nihil/remember-common';
import { NodeAction } from '../../enums/node-action.enum';
import { Node } from '../../models/node';
import { NodeService } from '../../services/node.service';
import { Navigator } from './../../classes/navigator';

@Component({
  selector: 'app-graph-viewer',
  templateUrl: './graph-viewer.component.html',
  styleUrls: ['./graph-viewer.component.sass'],
  animations: [
    trigger('foldInOutVertical', [
      transition('void => *', [
        style({ height: '0', overflow: 'hidden', paddingTop: '0', paddingBottom: '0' }),
        animate('0.5s ease-out', style({
          height: '*',
          overflow: '*',
          paddingTop: '*',
          paddingBottom: '*',
        }))
      ]),
      transition('* => void', [
        style({ overflow: 'hidden' }),
        animate('0.5s ease-out', style({
          height: '0',
          paddingTop: '0',
          paddingBottom: '0',
        }))
      ])
    ]),
    trigger('fadeInOut', [
      transition('void => *', [
        sequence([
          style({ opacity: '0', height: '0', overflow: 'hidden' }),
          animate('0.5s', style({ opacity: '0' })),
          style({ opacity: '0', height: '*', overflow: 'visible' }),
          animate('0.5s ease-out', style({
            opacity: '1'
          }))
        ])
      ]),
      transition('* => void', [
        animate('0.5s ease-out', style({
          opacity: '0'
        }))
      ]),
    ]),
    trigger('currentNodeChange', [
      transition('* => *', [

      ])
    ]),
    trigger('itemsChanged', [
      transition('* => showing', [
        query('@fadeInOut', [
          stagger(500, [
            animateChild()
          ])
        ])
      ])
    ])
  ]
})
export class GraphViewerComponent implements OnInit, AfterViewInit {

  @ViewChild('container') container!: any;
  @ViewChild('graphView') graphView!: any;

  @Output() nodeClicked = new EventEmitter<Node>();
  @Output() navigateToNode = new EventEmitter<string>();

  @Input() public activeNode!: Node;
  public _node!: Node;
  public nodeChanged!: Node;
  public tempElement!: any | null;
  public tempElementTransition = true;
  public tempPositionTransition = true;
  public noTransition = true;
  public lastClicked!: any;
  public staggerItems = false;

  @Input() set node(node: Node) {
    if(node == this._node) return;

    if(!!node) {
      this.nodeChanged = node;
      this.tempElement = node;
      this.tempElementTransition = true;
      this.tempPositionTransition = true;
      let item = this.lastClicked;
      if(item && item.position) {
        this.tempElement.position = {};
        this.tempElement.position.x = item.position.x;
        this.tempElement.position.y = item.position.y;

        setTimeout(() => {
          this.tempElement.position.x = this.centralNode.position.x;
          this.tempElement.position.y = this.centralNode.position.y;
          setTimeout(() => {
            this.tempElementTransition = false;
            this._node = node;

            this.centralNode = {
              ...this.centralNode,
              name: node.name
            }

            this.setup();
            this.updateDragConstraints();
            this.updateWindowOffset();
            this.updateSvgObjects();
            this.applyViewFilters();
            this.tempElementTransition = false;
            this.tempElement.position.x = this.centralNode.position.x;
            this.tempElement.position.y = this.centralNode.position.y;

            this.tempPositionTransition = false;
            this.staggerItems;

            setTimeout(() => {
              // this.tempElement.position.x = this.centralNode.position.x;
              // this.tempElement.position.y = this.centralNode.position.y;
              this.tempElement = null;
            }, 300);
          }, 500)
        }, 0)
      } else {
        this._node = node;
        this.tempElement = null;
        this.centralNode = {
          ...this.centralNode,
          name: node.name
        }
        this.noTransition = true;
        this.setup();
        this.updateDragConstraints();
        this.updateWindowOffset();
        this.updateSvgObjects();
        this.applyViewFilters();
        this.noTransition = false;
      }
    }
  }

  @Input() set links(val: Node[]) {
    this.noTransition = true;
    this.setup();
    this.updateDragConstraints();
    this.updateWindowOffset();
    this.updateSvgObjects();
    this.applyViewFilters();
    this.noTransition = false;
  }

  @Input() set children(val: Node[]) {
    this.noTransition = true;
    this.setup();
    this.updateDragConstraints();
    this.updateWindowOffset();
    this.updateSvgObjects();
    this.applyViewFilters();
    this.noTransition = false;
  }

  @Input() set parents(val: Node[]) {
    this.noTransition = true;
    this.setup();
    this.updateDragConstraints();
    this.updateWindowOffset();
    this.updateSvgObjects();
    this.applyViewFilters();
    this.noTransition = false;
  }

  get node() {
    return this._node;
  }

  @Input() navigator!: Navigator;

  constructor(
    public nodeService: NodeService,
    private dialog: MatDialog
  ) {}

  public sectionCounts: { [key: string]: number } = {};
  public sections!: { [key: string]: Section};
  public totalCount: number = 0;
  public anglePerItem!: number;
  public itemWidth: number = 200;
  public itemHeight: number = 200;
  public itemPadding: number = 0;
  public totalSpace: number = 0;
  public zoom: number = 1;
  public isMinZoom: boolean = false;
  public isMaxZoom: boolean = false;

  //Absolute positioning
  public center: number = 0;

  public sectionsArray: Section[] = [];

  public centralNode: any = {
    position: {
      x: 0,
      y: 0,
    },
    name: ''
  };

  filtersOpened: boolean = false;

  nodeTypeIconMap: { [key: string | number]: string } = {
    [NodeType.Container]: 'folder',
    [NodeType.File]: 'file',
    [NodeType.Root]: 'home',
    [NodeType.View]: 'panorama'
  }

  lastMovement: number = 0;

  actionMap: { [key: number]: { [key: number]: any }} = {
    [SectionType.Parents]: {
      [NodeAction.NodeDeleted]: (value: string) => ({
        action: NodeAction.RemoveParents,
        value: [value]
      }),
    },
    [SectionType.Children]: {
      [NodeAction.NodeDeleted]: (value: string) => ({
        action: NodeAction.RemoveChildren,
        value: [value]
      }),
    },
    [SectionType.Links]: {
      [NodeAction.NodeDeleted]: (value: string) => ({
        action: NodeAction.RemoveLinks,
        value: [value]
      }),
    }
  }

  ngOnInit(): void {}

  setup() {
    if(!this.node) return;

    const parentsCount = this.node.parents.length;
    const childrenCount = this.node.children.length;
    const linksCount = this.node.links.length;

    this.totalCount = parentsCount + childrenCount + linksCount;

    let totalCount = this.nodeService.state.isOwner ? this.totalCount + 3 : this.totalCount;

    this.anglePerItem = 360 / (totalCount);

    //Base of 60deg per section, then give space based on number of elements

    this.sections = {
      ["parents"]: {
        name: "Parents",
        count: parentsCount,
        type: SectionType.Parents,
        // angle: this.anglePerItem * (parentsCount + 1),
        angle: 120,
        items: this.node.parents.map(x => ({ ...x })) as any[],
        topWidth: 0,
        points: [],
        svgPoints: '',
        svgStyle: '',
        color: 'darkgray',
        leftAngle: 0,
        rightAngle: 0,
        middleAngle: 0,
        leftCorner: { x: 0, y: 0 },
        rightCorner: { x: 0, y: 0 },
        middleCorner: { x: 0, y: 0 },
        leftCurvePoint: { x: 0, y: 0 },
        rightCurvePoint: { x: 0, y: 0 },
        curveBase: { x: 0, y: 0 },
        addItem: { position: { x: 0, y: 0} },
        labelPoint: { position: { x: 0, y: 0 } }
      },
      ["children"]: {
        name: "Children",
        count: childrenCount,
        type: SectionType.Children,
        // angle: this.anglePerItem * (childrenCount + 1),
        angle: 120,
        items: this.node.children.map(x => ({ ...x })) as any[],
        topWidth: 0,
        points: [],
        svgPoints: '',
        svgStyle: '',
        color: 'darkgray',
        leftAngle: 0,
        rightAngle: 0,
        middleAngle: 0,
        leftCorner: { x: 0, y: 0 },
        rightCorner: { x: 0, y: 0 },
        middleCorner: { x: 0, y: 0 },
        leftCurvePoint: { x: 0, y: 0 },
        rightCurvePoint: { x: 0, y: 0 },
        curveBase: { x: 0, y: 0 },
        addItem: { position: { x: 0, y: 0} },
        labelPoint: { position: { x: 0, y: 0 } }
      },
      ["links"]: {
        name: "Links",
        count: linksCount,
        type: SectionType.Links,
        // angle: this.anglePerItem * (linksCount + 1),
        angle: 120,
        items: this.node.links.map(x => ({ ...x })) as any[],
        topWidth: 0,
        points: [],
        svgPoints: '',
        svgStyle: '',
        color: 'darkgray',
        leftAngle: 0,
        rightAngle: 0,
        middleAngle: 0,
        leftCorner: { x: 0, y: 0 },
        rightCorner: { x: 0, y: 0 },
        middleCorner: { x: 0, y: 0 },
        leftCurvePoint: { x: 0, y: 0 },
        rightCurvePoint: { x: 0, y: 0 },
        curveBase: { x: 0, y: 0 },
        addItem: { position: { x: 0, y: 0} },
        labelPoint: { position: { x: 0, y: 0 } }
      }
    }

    this.sectionsArray = [
      this.sections['parents'],
      this.sections['children'],
      this.sections['links']
    ]

    this.calculateSectionPositions();
  }

  ngAfterViewInit() {
    this.onResize();
  }

  degreeToRadians(deg: number) {
    return deg / 180 * Math.PI
  }

  calculateItemPositions(section: Section) {
    const itemsCount = section.count;

    const addItem = {
      position: {
        x: 0,
        y: 0
      }
    };

    let rowsCount = 0;

    for(let i = 0; i < itemsCount + 1; i += i + 1) {
      rowsCount++;
    }

    const itemSpaceWidth = this.itemWidth + this.itemPadding;

    const itemSpaceHeight = this.itemHeight + this.itemPadding;

    const sectionAngle = section.angle;

    const lowerRadiusLength = itemSpaceWidth / Math.tan(this.degreeToRadians(sectionAngle));

    let targetRadiusLength = lowerRadiusLength + itemSpaceHeight / 2;

    if(targetRadiusLength < itemSpaceHeight) targetRadiusLength = itemSpaceHeight;

    let sectionHeight = Math.sqrt(Math.pow(rowsCount * targetRadiusLength, 2) + Math.pow(rowsCount * itemSpaceWidth, 2));

    section.topWidth = targetRadiusLength * rowsCount * Math.tan(this.degreeToRadians(sectionAngle))

    let positions = this.getItemPositions(itemsCount + 1, itemSpaceWidth, targetRadiusLength);

    for(let { position, index } of section.items.map((position, index) => ({ position, index }))) {
      section.items[index].position = positions[index];
    }

    section.addItem.position = positions[positions.length - 1];

    return {
      height: sectionHeight
    }
  }

  getItemPositions(itemsCount: number, itemSpaceWidth: number, targetRadiusLength: number) {
    let rowsCount = 0;

    let positions = [];

    let startOffset = targetRadiusLength / 2;

    let sum = 0;

    for(let i = 1; sum <= itemsCount; i++) {
      sum += i;
      rowsCount++;
    }

    let counter = 0;

    for(let row = 1; row <= rowsCount; row++) {

      const offset = row * itemSpaceWidth / 2 * 1.5 ;

      for(let col = 1; col <= row; col++) {

        if(counter == itemsCount) {
          continue
        };

        const targetLeftOffset = (2 * col - 1) * itemSpaceWidth / 2 * 1.5 /* / 2 */ - offset;

        const itemCenter = {
          x: targetLeftOffset,
          y: startOffset + (Math.sqrt(Math.pow(itemSpaceWidth, 2) - Math.pow(itemSpaceWidth / 2, 2)) ) * row / 2
        };

        positions.push(itemCenter);

        counter++;
      }
    }

    return positions;
  }

  calculateSectionPositions() {

    let currentRotationOffset = 0; // Current rotation offset, used to calculate sections with applied offset angle
    let requiredRadius = 100; // Height required to fit elements in the view, equals max section height

    for(let sectionKey in this.sections) {
      const section = this.sections[sectionKey];
      const { height } = this.calculateItemPositions(section);

      let labelHeight = this.itemHeight / 2;

      if(height > requiredRadius) requiredRadius = height;

      if(currentRotationOffset != 0) currentRotationOffset += section.angle / 2;

      const rightAngle = section.angle / 2;
      const leftAngle = -section.angle / 2;

      section.leftAngle = leftAngle + currentRotationOffset;
      section.rightAngle = rightAngle + currentRotationOffset;
      section.middleAngle = currentRotationOffset;

      for(let item of section.items) {

        const angle = item.position.x >= 0 ? rightAngle : leftAngle;

        const tanA = Math.tan(this.degreeToRadians(angle));
        const y = item.position.x / tanA;

        // Lines
        const line = {
          start: { x: 0, y: 0 },
          middle: this.rotatePointAroundOrigin(item.position.x, y, currentRotationOffset),
          end: this.rotatePointAroundOrigin(item.position.x, item.position.y, currentRotationOffset),
          svgPosition: ''
        }

        line.svgPosition = `M ${line.start.x} ${line.start.y} C ${line.middle.x} ${line.middle.y}, ${line.middle.x} ${line.middle.y}, ${line.end.x} ${line.end.y}`;

        item.line = line;

        //rotate point around origin(along with section)
        const newPosition = this.rotatePointAroundOrigin(item.position.x, item.position.y, currentRotationOffset);
        item.position = newPosition;
      }

      section.addItem.position = this.rotatePointAroundOrigin(
        section.addItem.position.x,
        section.addItem.position.y,
        currentRotationOffset
      )

      section.labelPoint.position = this.rotatePointAroundOrigin(
        0,
        labelHeight,
        currentRotationOffset
      );

      currentRotationOffset += section.angle / 2;
    }

    // calculate corners for sections
    for(let section of this.sectionsArray) {
      const rotatedLeft = this.rotatePointAroundOrigin(0, requiredRadius, section.leftAngle);
      const rotatedMiddle = this.rotatePointAroundOrigin(0, requiredRadius, section.middleAngle);
      const rotatedRight = this.rotatePointAroundOrigin(0, requiredRadius, section.rightAngle);

      section.leftCorner = { x: (rotatedLeft.x - requiredRadius) * -1, y: (rotatedLeft.y - requiredRadius) * -1 }
      section.middleCorner =  { x: (rotatedMiddle.x - requiredRadius) * -1, y: (rotatedMiddle.y - requiredRadius) * -1 }
      section.rightCorner = { x: (rotatedRight.x - requiredRadius) * -1, y: (rotatedRight.y - requiredRadius) * -1 }

      const distanceDifference = { x: rotatedLeft.x - rotatedRight.x, y: rotatedLeft.y - rotatedRight.y };
      const distanceLength = Math.sqrt(Math.pow(distanceDifference.x, 2) + Math.pow(distanceDifference.y, 2));

      const targetLength = distanceLength / 2;
      const middlePoint = { x:rotatedLeft.x - distanceDifference.x / 2, y: rotatedLeft.y - distanceDifference.y / 2 };
      const rotatedCurveBase = this.rotatePointAroundOrigin(middlePoint.x, middlePoint.y, section.middleAngle);

      const ax = rotatedLeft.x - 0;
      const ay = rotatedLeft.y - 0;

      const bx = rotatedRight.x - 0;
      const by = rotatedRight.y - 0;

      const q1 = Math.pow(ax, 2) + Math.pow(ay, 2);
      const q2 = q1 + ax * bx + ay * by;
      const k2 = (4/3) * (Math.sqrt(2 * q1 * q2) - q2) / (ax * by - ay * bx);

      const x2 = 0 + ax - k2 * ay;
      const y2 = 0 + ay + k2 * ax;
      const x3 = 0 + bx + k2 * by;
      const y3 = 0 + by - k2 * bx;

      // const rotatedLeftCurvePoint = this.rotatePointAroundPoint(rotatedLeft.x, rotatedLeft.y, rotatedLeft.x - requiredRadius / Math.PI, rotatedLeft.y + targetLength, section.middleAngle);
      section.leftCurvePoint = { x: (x2 - requiredRadius) * -1, y: (y2 - requiredRadius) * -1 };

      // const rotatedRightCurvePoint = this.rotatePointAroundPoint(rotatedRight.x, rotatedRight.y, rotatedRight.x + requiredRadius / Math.PI, rotatedRight.y + targetLength, section.middleAngle);
      section.rightCurvePoint = { x: (x3 - requiredRadius) * -1, y: (y3 - requiredRadius) * -1 };

      section.curveBase = { x: (rotatedCurveBase.x - requiredRadius) * -1, y: (rotatedCurveBase.y - requiredRadius) * -1 };
    }

    this.totalSpace = requiredRadius * 2;
    const halfSpace = this.totalSpace / 2;

    currentRotationOffset = 0;

    for(let sectionKey in this.sections) {

      const section = this.sections[sectionKey];

      const left = (this.totalSpace - section.topWidth) / 2;
      const right = section.topWidth + left;

      section.points = [
        { x: 0, y: 0 },
        this.rotatePointAroundOrigin(0, halfSpace, -section.angle / 2),
        this.rotatePointAroundOrigin(0, halfSpace, 0),
        this.rotatePointAroundOrigin(0, halfSpace, section.angle / 2),
        { x: 0, y: 0 }
      ]

      if(currentRotationOffset != 0) currentRotationOffset += section.angle / 2;

      const rotatedPoints = section.points
        .map(p => this.rotatePointAroundOrigin(p.x, p.y, currentRotationOffset));

      // rotatedPoints[1] = this.getEdgePoint(rotatedPoints[1]);
      // rotatedPoints[2] = this.getCornerPoint(rotatedPoints[2]);
      // rotatedPoints[3] = this.getEdgePoint(rotatedPoints[3]);

      const normalizedPoints = rotatedPoints
        .map(p => ({ x: (p.x - requiredRadius) * -1, y: (p.y - requiredRadius) * -1 }));

      section.points = normalizedPoints;

      section.svgPoints =
      // [
      //   { x: 50, y: 0 },
      //   { x: 100, y: 25 },
      //   { x: 100, y: 75 },
      //   { x: 50, y: 100 },
      //   { x: 0, y: 75 },
      //   { x: 0, y: 25 },
      // ]
      normalizedPoints
        .map(p => `${p.x},${p.y}`).join(' ');

      section.svgStyle = `fill:${section.color}; stroke: ${section.color};`

      //Rotate items
      for(let item of section.items) {
        item.rotation = currentRotationOffset;
        item.position.x = (item.position.x - requiredRadius) * -1;
        item.position.y = (item.position.y - requiredRadius) * -1;
        let oldLine = item.line;
        let line = {
          start: {
            x: (item.line.start.x - requiredRadius) * -1,
            y: (item.line.start.y - requiredRadius) * -1,
          },
          middle: {
            x: (item.line.middle.x - requiredRadius) * -1,
            y: (item.line.middle.y - requiredRadius) * -1,
          },
          end: {
            x: (item.line.end.x - requiredRadius) * -1,
            y: (item.line.end.y - requiredRadius) * -1,
          },
          svgPosition: ''
        };

        line.svgPosition = `M ${line.start.x} ${line.start.y} C ${line.middle.x} ${line.middle.y}, ${line.middle.x} ${line.middle.y}, ${line.end.x} ${line.end.y}`

        item.line = line;
      }

      //Rotate add items
      section.addItem.position.x = (section.addItem.position.x - requiredRadius) * -1;
      section.addItem.position.y = (section.addItem.position.y - requiredRadius) * -1;

      section.labelPoint.position.x = (section.labelPoint.position.x - requiredRadius) * -1;
      section.labelPoint.position.y = (section.labelPoint.position.y - requiredRadius) * -1;

      currentRotationOffset += section.angle / 2;
    }

    this.centralNode = {
      ...this.centralNode,
      position: {
        x: requiredRadius,
        y: requiredRadius
      }
    };
  }

  findDisplayElement(node: Node) {
    for(let section of this.sectionsArray) {
      let item = section.items.find(x => node.id == x.id);

      if(item) return item;
    }

    return null;
  }

  getEdgePoint(point: Point) {

      if(point.x == 0 && point.y == 0) return { x: 0, y: 0 };

      const halfSpace = this.totalSpace / 2;
      const tanA = point.y / point.x;
      let angle = tanA * 180 / Math.PI;

      angle = angle % 360;
      if (angle < 0) angle = 360 + angle;

      let result: Point = { x: 0, y: 0 };

      if(angle >= 0 && angle < 45) {
        result = { x: halfSpace / tanA, y: halfSpace }
      } else if (angle == 45) {
        result = { x: halfSpace, y: halfSpace };
      } else if(angle > 45 && angle < 135) {
        result = { x: halfSpace, y: tanA * halfSpace }
      } else if (angle == 135) {
        result = { x: halfSpace, y: -halfSpace };
      } else if(angle > 135 && angle < 225) {
        result = { x: -halfSpace / tanA, y: -halfSpace }
      } else if (angle == 225) {
        result = { x: -halfSpace, y: -halfSpace};
      } else if (angle > 225 && angle < 315) {
        result = { x: halfSpace, y: tanA * halfSpace }
      } else if(angle == 315) {
        result = { x: -halfSpace, y: halfSpace };
      } else if(angle > 315 && angle <= 360) {
        result = { x: halfSpace / tanA, y: halfSpace }
      }

      return result;
  }

  getCornerPoint(point: Point) {
    const halfSpace = this.totalSpace / 2;

    if(point.x == 0 || point.y == 0) return { x: point.x ? halfSpace : 0, y: point.y ? halfSpace : 0 };

    const tanA = point.y / point.x;
    let angle = tanA * 180 / Math.PI;

    angle = angle % 360;
    if (angle < 0) angle = 360 + angle;

    let result: Point = { x: 0, y: 0 };

    if(point.x == 0 && point.y > 0) {
      result = { x: 0, y: halfSpace };
    } else if(point.x > 0 && point.y > 0) {
      result = { x: halfSpace, y: halfSpace }
    } else if (point.y == 0 && point.x > 0) {
      result = { x: halfSpace, y: 0 };
    } else if(point.x > 0 && point.y < 0) {
      result = { x: halfSpace, y: -halfSpace }
    } else if (point.x == 0 && point.y < 0) {
      result = { x: 0, y: -halfSpace };
    } else if(point.x < 0 && point.y < 0) {
      result = { x: -halfSpace, y: -halfSpace }
    } else if (point.x < 0 && point.y == 0) {
      result = { x: -halfSpace, y: 0};
    } else if (point.x < 0 && point.y > 0) {
      result = { x: -halfSpace, y: halfSpace }
    }

    return result;
}

  rotatePointAroundPoint(ox: number, oy: number, px: number, py: number, angle: number) {
    const radAngle = this.degreeToRadians(angle);

    const x = Math.cos(radAngle) * (px - ox) - Math.sin(radAngle) * (py - oy) + ox;
    const y = Math.sin(radAngle) * (px - ox) + Math.cos(radAngle) * (py - oy) + oy;

    return { x, y }
  }

  rotatePointAroundOrigin(px: number, py: number, angle: number) {
    const radAngle = this.degreeToRadians(angle);

    const x = Math.cos(radAngle) * px - Math.sin(radAngle) * py;
    const y = Math.sin(radAngle) * px + Math.cos(radAngle) * py;

    return { x, y }
  }

  private maxZoom = 6;
  private minZoom = 0.1;
  private zoomStep = 0.1;
  private scrollZoomStep = 0.05;

  scrollZoom(ev: any) {
    const step = ev.wheelDeltaY > 0 ? this.scrollZoomStep : -this.scrollZoomStep;
    const newZoom = this.zoom + step;

    if(newZoom > this.maxZoom || newZoom < this.minZoom) return;

    this.zoom = newZoom;

    this.onZoomChange();

    ev.preventDefault();
  }

  increaseZoom() {
    let newZoom = this.zoom + this.zoomStep;

    if(newZoom > this.maxZoom) newZoom = this.maxZoom;

    this.zoom = newZoom;

    this.onZoomChange();
  }

  decreaseZoom() {
    let newZoom = this.zoom - this.zoomStep;

    if(newZoom < this.minZoom) newZoom = this.minZoom;

    this.zoom = newZoom;

    this.onZoomChange();
  }

  onZoomChange() {
    this.isMaxZoom = this.zoom == this.maxZoom;
    this.isMinZoom = this.zoom == this.minZoom;

    this.updateDragConstraints();
    this.updateWindowOffset()
    this.updateSvgObjects()
  }

  updateSvgObjects() {
    for(let section of this.sectionsArray) {
      const points = section.points;

      section.svgPoints = points
        .map(p => `${p.x * this.zoom},${p.y * this.zoom}`).join(' ');

      for(let item of section.items) {
        const line = item.line;
        line.svgPosition = `M ${line.start.x * this.zoom} ${line.start.y * this.zoom} C ${line.middle.x * this.zoom} ${line.middle.y * this.zoom }, ${line.middle.x * this.zoom} ${line.middle.y * this.zoom}, ${line.end.x * this.zoom} ${line.end.y * this.zoom}`;
      }
    }
  }

  public windowOffsetLeft: number = 0;
  public windowOffsetTop: number = 0;
  public windowOffsetLeftConstraint: number = 0;
  public windowOffsetTopConstraint: number = 0;

  public dragging: boolean = false;
  public dragViewData!: any;

  public dragData = {
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    startLeftOffset: this.windowOffsetLeft,
    startTopOffset: this.windowOffsetTop
  }

  mouseDown(ev: MouseEvent) {
    this.startDrag(ev);
  }

  mouseMove(ev: MouseEvent) {
    this.moveDrag(ev);
  }

  mouseUp(ev: MouseEvent) {
    this.endDrag(ev);
  }

  startDrag(ev: MouseEvent) {
    this.dragging = true;

    const viewBox = this.container.nativeElement.getBoundingClientRect()

    this.dragViewData = viewBox;

    const x = ev.x - viewBox.left + this.windowOffsetLeft;
    const y = ev.y - viewBox.top + this.windowOffsetTop;

    this.dragData = {
      startLeftOffset: this.windowOffsetLeft,
      startTopOffset: this.windowOffsetTop,
      startX: x,
      startY: y,
      currentX: x,
      currentY: y
    }
  }

  moveDrag(ev: MouseEvent) {
    if(!this.dragging) return;

    const viewBox = this.dragViewData;

    const x = ev.x - viewBox.left;
    const y = ev.y - viewBox.top;

    let offsetX = this.dragData.startX - x;
    let offsetY = this.dragData.startY - y;

    this.windowOffsetLeft = offsetX;
    this.windowOffsetTop = offsetY;

    let movX = this.dragData.startLeftOffset - offsetX;
    let movY = this.dragData.startTopOffset - offsetY;

    const mov = Math.sqrt(
      movX ? Math.pow(movX, 2) : 0 + movY ? Math.pow(movY, 2) : 0
    );

    this.lastMovement = mov;

    this.updateWindowOffset();
  }

  endDrag(ev: MouseEvent) {
    this.dragging = false;

    this.dragData = {
      startLeftOffset: 0,
      startTopOffset: 0,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0
    }
  }

  containerWidth: number = 0;
  containerHeight: number = 0;

  onResize() {
    const rect = this.container.nativeElement.getBoundingClientRect();
    this.containerWidth = rect.width;
    this.containerHeight = rect.height;
    this.updateDragConstraints();
  }

  updateDragConstraints() {
    const left = (this.totalSpace * this.zoom - this.containerWidth) / 2;
    const top = (this.totalSpace * this.zoom - this.containerHeight) / 2;
    this.windowOffsetLeftConstraint = left < 0 ? 0 : left;
    this.windowOffsetTopConstraint = top < 0 ? 0 : top;
  }

  updateWindowOffset() {
    if(this.windowOffsetLeft > this.windowOffsetLeftConstraint)
      this.windowOffsetLeft = this.windowOffsetLeftConstraint;
    if(this.windowOffsetLeft < -this.windowOffsetLeftConstraint)
      this.windowOffsetLeft = -this.windowOffsetLeftConstraint;
    if(this.windowOffsetTop > this.windowOffsetTopConstraint)
      this.windowOffsetTop = this.windowOffsetTopConstraint;
    if(this.windowOffsetTop < -this.windowOffsetTopConstraint)
      this.windowOffsetTop = -this.windowOffsetTopConstraint;
  }

  onNodeClick(item: Node) {
    if(this.lastMovement > 30 * this.zoom) {
      this.lastMovement = 0;
      return;
    }

    this.lastClicked = item;

    this.nodeClicked.emit(item);
  }

  onAddNodeClick(section: Section) {
    switch(section.name) {
      case 'Parents':
        this.openAddParents();
        break;
      case 'Children':
        this.openAddChildren();
        break;
      case 'Links':
        this.openAddLinks();
        break;
    }
  }

  preventDefault(ev: any) { //TODO move to util
    ev.preventDefault();
  }

  stopPropagation(ev: any) {
    ev.stopPropagation();
  }

  toggleOpenFilters() {
    this.filtersOpened = !this.filtersOpened;
  }

  viewFilters = {
    name: '',
    description: '',
    type: ''
  }

  filter: boolean = false;

  applyViewFilters() {
    let fName = this.viewFilters.name;
    let fDesc = this.viewFilters.description;
    let fType = this.viewFilters.type;

    let central = this.node as any

    let matches = true;

    if(!!fName)
      matches &&= central.name.includes(fName);

    if(!!fDesc)
      matches &&= central.description.includes(fDesc);

    if(!!fType)
      matches &&= central.type == +fType;

    central.filtered = matches;

    for(let sec of this.sectionsArray) {
      for(let item of sec.items) {
        let matches = true;

        if(!!fName)
          matches &&= item.name.includes(fName);

        if(!!fDesc)
          matches &&= item.description.includes(fDesc);

        if(!!fType)
          matches &&= item.type == +fType;

        item.filtered = matches;
      }
    }

    this.checkFilterSet()
  }

  checkFilterSet() {
    this.filter =
      !!this.viewFilters.description ||
      !!this.viewFilters.name ||
      !!this.viewFilters.type
  }

  clearViewFilters() {
    this.viewFilters = {
      name: '',
      description: '',
      type: ''
    }

    this.applyViewFilters();
  }

  navigatePrevious() {
    if(!this.navigator.hasPrevious) return;

    const prev = this.navigator.previous();
    this.nodeService.state.navigatedBack = true;

    if(!prev) return;

    this.navigateToNode.emit(prev);
  }

  navigateNext() {
    if(!this.navigator.hasNext) return;

    const next = this.navigator.next();

    if(!next) return;

    this.navigateToNode.emit(next);
  }

  async openAddChildren() {
    this.nodeService.action({
      action: NodeAction.OpenAddChildren,
      value: null,
      context: null as any
    })
  }

  async openAddParents() {
    this.nodeService.action({
      action: NodeAction.OpenAddParents,
      value: null,
      context: null as any
    })
  }

  async openAddLinks() {
    this.nodeService.action({
      action: NodeAction.OpenAddLinks,
      value: null,
      context: null as any
    })
  }

  nodeAction(ev: { action: NodeAction, value: string }, section: SectionType) {
    let data = (this.actionMap as any)[section][ev.action](ev.value);
    this.nodeService.action({ ...data, context: this._node })
  }
}


export type NodeDisplay = {
  position: Point;
  rotation: number;
  filtered: boolean;
  line: {
    start: Point;
    middle: Point;
    end: Point;
    svgPosition: string;
  };
}

export type Section = {
  name: string,
  type: SectionType,
  count: number,
  angle: number,
  items: (Node & NodeDisplay)[],
  topWidth: number,
  points: Point[],
  svgPoints: string,
  svgStyle: string,
  color: string,
  leftAngle: number,
  rightAngle: number,
  middleAngle: number,
  leftCorner: Point;
  rightCorner: Point;
  middleCorner: Point;
  leftCurvePoint: Point;
  rightCurvePoint: Point;
  curveBase: Point;
  addItem: {
    position: Point;
  };
  labelPoint: {
    position: Point;
  }
};

enum SectionType {
  Parents,
  Children,
  Links
}



export type Point = { x: number, y: number };

