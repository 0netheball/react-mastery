import dayjs from 'dayjs';

export function DeliveryDate({ selectedDeliveryOption }) {
  return (
    <div className="delivery-date">
      Дата доставки: {dayjs(selectedDeliveryOption.estimatedDeliveryTimeMs).format('dddd, D MMMM')}
    </div>
  );
}