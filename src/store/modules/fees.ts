import BigNumber from "bignumber.js";
import { getValueOfUnit, Unit } from "../../units";
import {
    ESTIMATED_FEE_HBAR,
    ESTIMATED_FEE_TINYBAR,
    MAX_FEE_HBAR,
    MAX_FEE_TINYBAR
} from "../getters";

export interface State {
    estimatedFeeHbar: BigNumber;
    maxFeeHbar: BigNumber;
}

export default {
    state: {
        estimatedFeeHbar: new BigNumber(0.120_000_000),
        maxFeeHbar: new BigNumber(1)
    } as State,
    // TODO: JFC replace this with actual units from the SDK when ready
    getters: {
        [ESTIMATED_FEE_HBAR]: (state: State): BigNumber => {
            return state.estimatedFeeHbar;
        },
        [ESTIMATED_FEE_TINYBAR]: (state: State): BigNumber => {
            return state.estimatedFeeHbar.multipliedBy(
                getValueOfUnit(Unit.Hbar)
            );
        },
        [MAX_FEE_HBAR]: (state: State) => (
            remainingBalanceHBar: BigNumber
        ): BigNumber => {
            return BigNumber.max(state.maxFeeHbar, remainingBalanceHBar);
        },
        [MAX_FEE_TINYBAR]: (state: State) => (
            remainingBalanceTinybar: BigNumber
        ): BigNumber => {
            return BigNumber.max(
                state.maxFeeHbar,
                remainingBalanceTinybar.dividedBy(getValueOfUnit(Unit.Hbar))
            ).multipliedBy(getValueOfUnit(Unit.Hbar));
        }
    }
};
