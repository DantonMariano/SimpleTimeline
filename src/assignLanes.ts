import moment from "moment";

// Function to assign items to lanes
export function assignLanes(items: any[]) {
  const sortedItems = items.sort((a, b) =>
    moment(a.start).isBefore(moment(b.start)) ? -1 : 1
  );
  const lanes: any[][] = [];

  function assignItemToLane(item: any) {
    for (const lane of lanes) {
      if (moment(lane[lane.length - 1].end).isBefore(moment(item.start))) {
        lane.push(item);
        return;
      }
    }
    lanes.push([item]);
  }

  for (const item of sortedItems) {
    assignItemToLane(item);
  }

  return lanes;
}
