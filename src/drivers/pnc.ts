import {
  sleep,
  clickRefUntilRefFound,
  ensureStateChange,
  screenVSRefDiff,
  causeEffect,
  conditionGenerator,
  actionGenerator,
} from "./execution";
import { pncRefs } from "../reference";

const transitions = {
  enterFactoryFromMainMenu: async () => {
    await causeEffect(
      conditionGenerator(pncRefs, "03_factory_collection/open_factory"),
      actionGenerator(pncRefs, "03_factory_collection/open_factory")
    );
  },
  toggleTopDrawer: async () => {
    await causeEffect(
      conditionGenerator(pncRefs, "00_transitions/open_top_drawer", 0.2),
      actionGenerator(pncRefs, "00_transitions/open_top_drawer")
    );
  },
  topDrawerNeuralSearch: async () => {
    await causeEffect(
      conditionGenerator(pncRefs, "00_transitions/top_drawer_neural_search"),
      actionGenerator(pncRefs, "00_transitions/top_drawer_neural_search")
    );
  },
  topDrawerFactory: async () => {
    await causeEffect(
      conditionGenerator(pncRefs, "00_transitions/top_drawer_factory"),
      actionGenerator(pncRefs, "00_transitions/top_drawer_factory")
    );
  },
  topDrawerExplore: async () => {
    await causeEffect(
      conditionGenerator(pncRefs, "00_transitions/top_drawer_explore"),
      actionGenerator(pncRefs, "00_transitions/top_drawer_explore")
    );
  },
  enterVulnerabilityCheck: async () => {
    await causeEffect(
      conditionGenerator(pncRefs, "07_vulnerability_check/vulnerability_check"),
      actionGenerator(pncRefs, "07_vulnerability_check/vulnerability_check")
    );
  },
};

const startup = {
  awayTooLong: async () => {
    await causeEffect(
      conditionGenerator(pncRefs, "01_login/away_too_long_notification"),
      actionGenerator(pncRefs, "01_login/away_too_long_notification_confirm")
    );
  },

  login: async () => {
    await causeEffect(
      conditionGenerator(pncRefs, "01_login/game_start"),
      actionGenerator(pncRefs, "01_login/game_start")
    );
  },

  announcements: async () => {
    await causeEffect(
      conditionGenerator(pncRefs, "02_announcements/event_notice"),
      actionGenerator(pncRefs, "02_announcements/event_notice_close")
    );

    await causeEffect(
      conditionGenerator(pncRefs, "02_announcements/login_reward"),
      actionGenerator(pncRefs, "02_announcements/login_reward_close")
    );
    await causeEffect(
      conditionGenerator(pncRefs, "02_announcements/login_reward"),
      actionGenerator(pncRefs, "02_announcements/login_reward_close")
    );

    await causeEffect(
      conditionGenerator(pncRefs, "02_announcements/monthly_sign_in"),
      actionGenerator(pncRefs, "02_announcements/monthly_sign_in_close")
    );

    await causeEffect(
      conditionGenerator(pncRefs, "02_announcements/event_notice_2_close"),
      actionGenerator(pncRefs, "02_announcements/event_notice_2_close")
    );
  },
};

const factory = {
  claimOrders: async () => {
    await causeEffect(
      conditionGenerator(pncRefs, "03_factory_collection/open_order_list"),
      actionGenerator(pncRefs, "03_factory_collection/open_order_list")
    );

    await causeEffect(
      conditionGenerator(
        pncRefs,
        "03_factory_collection/all_production_completed"
      ),
      actionGenerator(pncRefs, "03_factory_collection/production_list_close"),
      /**
       * if not all orders are claimed
       * claim the next order
       */
      async () => {
        await actionGenerator(pncRefs, "03_factory_collection/claim_order")();
        await causeEffect(
          // acknowledge rewards
          conditionGenerator(
            pncRefs,
            "03_factory_collection/claim_order_rewards",
            0.3
          ),
          actionGenerator(
            pncRefs,
            "03_factory_collection/claim_order_rewards_close"
          )
        );
      }
    );
  },
  resetOrders: async () => {
    async function maxAndStart() {
      await causeEffect(
        conditionGenerator(
          pncRefs,
          "03_factory_collection/factory_production_max"
        ),
        actionGenerator(pncRefs, "03_factory_collection/factory_production_max")
      );
      await causeEffect(
        conditionGenerator(
          pncRefs,
          "03_factory_collection/factory_production_max_start"
        ),
        actionGenerator(
          pncRefs,
          "03_factory_collection/factory_production_max_start"
        )
      );
    }

    async function swipeProductionList(times: number) {
      for (var i = 0; i < times; i++) {
        await actionGenerator(
          pncRefs,
          "03_factory_collection/factory_production_list_swipe_region",
          "SWIPE_UP"
        )();
      }
    }

    async function extractionMine() {
      await causeEffect(
        conditionGenerator(
          pncRefs,
          "03_factory_collection/factory_extraction_mine",
          0.4
        ),
        actionGenerator(
          pncRefs,
          "03_factory_collection/factory_extraction_mine"
        )
      );
      await causeEffect(
        conditionGenerator(
          pncRefs,
          "03_factory_collection/factory_extraction_mine_low_poly_rhombus"
        ),
        actionGenerator(
          pncRefs,
          "03_factory_collection/factory_extraction_mine_low_poly_rhombus"
        )
      );

      await maxAndStart();
    }

    async function suppliesWorkshop() {
      await causeEffect(
        conditionGenerator(
          pncRefs,
          "03_factory_collection/factory_supplies_workshop",
          0.4
        ),
        actionGenerator(
          pncRefs,
          "03_factory_collection/factory_supplies_workshop"
        )
      );

      await causeEffect(
        conditionGenerator(
          pncRefs,
          "03_factory_collection/factory_supplies_workshop_basic_search"
        ),
        actionGenerator(
          pncRefs,
          "03_factory_collection/factory_supplies_workshop_basic_search"
        )
      );

      await maxAndStart();
    }

    async function giftWorkshop() {
      await causeEffect(
        conditionGenerator(
          pncRefs,
          "03_factory_collection/factory_gift_workshop",
          0.4
        ),
        actionGenerator(pncRefs, "03_factory_collection/factory_gift_workshop")
      );

      await sleep(1000);

      await swipeProductionList(3);

      await causeEffect(
        conditionGenerator(
          pncRefs,
          "03_factory_collection/factory_gift_workshop_cake",
          0.5
        ),
        actionGenerator(
          pncRefs,
          "03_factory_collection/factory_gift_workshop_cake"
        )
      );

      await maxAndStart();
    }

    async function dataEncapsulationCenter() {
      await causeEffect(
        conditionGenerator(
          pncRefs,
          "03_factory_collection/factory_data_encapsulation_center",
          0.4
        ),
        actionGenerator(
          pncRefs,
          "03_factory_collection/factory_data_encapsulation_center"
        )
      );

      await sleep(1000);

      await swipeProductionList(1);

      await causeEffect(
        conditionGenerator(
          pncRefs,
          "03_factory_collection/factory_data_encapsulation_center_material_box",
          0.5
        ),
        actionGenerator(
          pncRefs,
          "03_factory_collection/factory_data_encapsulation_center_material_box"
        )
      );

      await maxAndStart();
    }

    await extractionMine();
    await suppliesWorkshop();
    await giftWorkshop();
    await dataEncapsulationCenter();
  },
};

const oasis = {
  claimResources: async () => {
    await causeEffect(
      conditionGenerator(
        pncRefs,
        "05_oasis_collection/top_drawer_claim_oasis_resouces"
      ),
      actionGenerator(
        pncRefs,
        "05_oasis_collection/top_drawer_claim_oasis_resouces"
      )
    );
  },
};

const neuralSearch = {
  navigateToBasicSearch: async () => {
    await causeEffect(
      conditionGenerator(pncRefs, "04_basic_search/basic_search"),
      async () => {},
      actionGenerator(pncRefs, "04_basic_search/neural_search_next_banner")
    );
  },
  basicSearchStart: async () => {
    await actionGenerator(pncRefs, "04_basic_search/basic_search_10")();
  },
  basicSearchContinuationCheck: async () => {
    await causeEffect(
      conditionGenerator(pncRefs, "04_basic_search/basic_search_insufficient"),
      actionGenerator(
        pncRefs,
        "04_basic_search/basic_search_insufficient_confirm"
      ),
      async () => {
        await causeEffect(
          conditionGenerator(pncRefs, "04_basic_search/basic_search_skip"),
          actionGenerator(pncRefs, "04_basic_search/basic_search_skip")
        );
        await causeEffect(
          conditionGenerator(pncRefs, "04_basic_search/basic_search_results"),
          actionGenerator(pncRefs, "04_basic_search/basic_search_results")
        );
        await sleep(1000);
        await actionGenerator(pncRefs, "04_basic_search/basic_search_10")();
      }
    );
  },
};

const vulnerabilityCheck = {
  enterStage: async () => {
    await causeEffect(
      conditionGenerator(
        pncRefs,
        "07_vulnerability_check/vulnerability_check_void_turbulance"
      ),
      actionGenerator(
        pncRefs,
        "07_vulnerability_check/vulnerability_check_void_turbulance"
      )
    );

    await causeEffect(
      conditionGenerator(
        pncRefs,
        "07_vulnerability_check/vulnerability_check_stage_selection"
      ),
      actionGenerator(
        pncRefs,
        "07_vulnerability_check/vulnerability_check_stage_selection"
      )
    );

    await causeEffect(
      conditionGenerator(
        pncRefs,
        "07_vulnerability_check/vulnerability_check_stage_start_confirm"
      ),
      actionGenerator(
        pncRefs,
        "07_vulnerability_check/vulnerability_check_stage_start_confirm"
      )
    );
  },
  battle: async () => {
    await causeEffect(
      conditionGenerator(
        pncRefs,
        "07_vulnerability_check/vulnerability_check_exit"
      ),
      actionGenerator(
        pncRefs,
        "07_vulnerability_check/vulnerability_check_exit"
      ),
      async () => {
        await causeEffect(
          conditionGenerator(
            pncRefs,
            "07_vulnerability_check/vulnerability_check_battle_start"
          ),
          actionGenerator(
            pncRefs,
            "07_vulnerability_check/vulnerability_check_battle_start"
          )
        );

        await causeEffect(
          conditionGenerator(
            pncRefs,
            "07_vulnerability_check/vulnerability_check_next_stage"
          ),
          actionGenerator(
            pncRefs,
            "07_vulnerability_check/vulnerability_check_next_stage"
          )
        );

        // Need to sleep long enough to ensure that exit battle does pop up
        // This seems shitty
        // TODO Improve implementation
        await sleep(5000);
      }
    );
  },
};

async function group00() {
  await startup.awayTooLong();
  await startup.login();
  await startup.announcements();
}

async function group01() {
  await transitions.enterFactoryFromMainMenu();
  await transitions.toggleTopDrawer();
  await oasis.claimResources();
  await transitions.toggleTopDrawer();
  await factory.claimOrders();
}

async function group02() {
  await transitions.toggleTopDrawer();
  await transitions.topDrawerNeuralSearch();
  await neuralSearch.navigateToBasicSearch();
  await neuralSearch.basicSearchStart();
  await neuralSearch.basicSearchContinuationCheck();
}

async function group03() {
  await transitions.toggleTopDrawer();
  await transitions.topDrawerFactory();
  await factory.resetOrders();
}

async function group04() {
  await transitions.toggleTopDrawer();
  await transitions.topDrawerExplore();
  await transitions.enterVulnerabilityCheck();
  await vulnerabilityCheck.enterStage();
  await vulnerabilityCheck.battle();
}

async function pnc1() {
  // await group00();
  // await group01();
  // await group02();
  // await group03();
  await group04();
}

pnc1();

// When i forget about await, things explode
// I don't actually know how that promise got rejected
// Maybe it has less to do w. logic and more so with phone not being able to process two commands at the same time?

// I should try to add more logical operations into my functions
// Though at that point it's not that unreasonable to ask why I can't just do that inherently in the language.
// I guess that on top of getting thigns to work, another priority I have is keeping everything as clean as possible

// TODO IMPLEMENT SEARCH FUNCTION
// WHEN WE DON'T KNOW WHERE THE ROI WILL BE
// Also have robustness, where program checks multiple points, generates confidence values
// WOULD BE IDEAL IF SCREENSHOT PROCEDURE COULD BE SPED UP
